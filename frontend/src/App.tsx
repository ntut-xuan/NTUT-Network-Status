import { faCircleNotch, faUpload, faWifi } from '@fortawesome/free-solid-svg-icons';
import { Col, Container, Navbar, Row } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import "../src/App.css"
import { useEffect, useState } from 'react';
import StatusBar from './components/StatusBar';
import { initializeApp } from "firebase/app";
import { collection, query, getDocs, getFirestore, where, documentId } from "firebase/firestore";
import dayjs from 'dayjs'
import { HeartbeatType, RecordStatusType, RecordType } from './types/NetworkType';
import StatusCard from './components/StatusCard';

function App() {
    const [records, setRecords] = useState<Map<string, (RecordType | null)>>(new Map())
    const [heartbeats, setHeartbeat] = useState<Map<string, (HeartbeatType | null)>>(new Map())
    const [latestNetworkStatus, setLatestNetworkStatus] = useState<RecordStatusType | null>(null)
    const [keys, setKeys] = useState<string[]>([])

    const getPingOption = () => {
        return {
            tooltip: {},
            xAxis: {
                data: keys
            },
            yAxis: {},
                series: [
                {
                    name: '延遲速度（毫秒）',
                    color: "blue",
                    type: 'line',
                    data: Array.from(records.values()).reverse().map((record) => {
                        return record == null ? 0 : record.Ping;
                    })
                }
            ]
        }
    }

    const getDownloadOption = () => {
        return {
            tooltip: {},
            xAxis: {
                data: keys
            },
            yAxis: {},
            series: [
                {
                    name: '下載速度（mbps）',
                    type: 'line',
                    color: "green",
                    data: Array.from(records.values()).reverse().map((record) => {
                        return record == null ? 0 : record.DownloadSpeed;
                    })
                }
            ]
        }
    }

    const getUploadOption = () => {
        return {
            tooltip: {},
            xAxis: {
                data: keys
            },
            yAxis: {},
            series: [
                {
                    name: '上傳速度（mbps）',
                    type: 'line',
                    color: "orange",
                    data: Array.from(records.values()).reverse().map((record) => {
                        return record == null ? 0 : record.UploadSpeed;
                    })
                }
            ]
        }
    }

    const firebaseConfig = {
        apiKey: "AIzaSyBMuY_Vktt0eJTEMSsKkRsg6lWD0yir4pc",
        authDomain: "ntut-network-status.firebaseapp.com",
        projectId: "ntut-network-status",
        storageBucket: "ntut-network-status.appspot.com",
        messagingSenderId: "910471094834",
        appId: "1:910471094834:web:2aae862237ce0087ee522b",
        measurementId: "G-NM3V4YK058"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const generate24HoursKey = () => {
        const keys = [] as string[]
        const now = dayjs(Date.now())
        for(let hour = 0; hour < 24; hour++){
            const targetHour = now.subtract(hour, "hour")
            const format = targetHour.format("YYYY-MM-DDTHH:00:00+08:00")
            keys.push(format)
        }
        return keys
    }

    const fetchRecordsAsync = async (collectionName: string) => {
        const keys = generate24HoursKey()
        const recordMap = new Map<string, (any | null)>()
        const db = getFirestore(app);
        const recordsQuery = query(collection(db, collectionName), where(documentId(), "in", keys))
        const recordsDocsSnap = await getDocs(recordsQuery);
        for(let key of keys){
            recordMap.set(key, null)
        }
        recordsDocsSnap.forEach((snapshot) => {
            recordMap.set(snapshot.id, snapshot.data())
        })
        return recordMap;
    }

    const getLatestNetworkStatus = () => {
        const currentTime = dayjs(Date.now())
        const currentTimeFormat = currentTime.format("YYYY-MM-DDTHH:00:00+08:00")
        
        if(heartbeats.has(currentTimeFormat)){
            const heartbeat = heartbeats.get(currentTimeFormat);
            if(heartbeat != null && !heartbeat.IsAlive){
                return {
                    networkStatus: "無法取得資料",
                    networkStatusColor: "Danger",
                    networkTime: currentTime.format("YYYY-MM-DD HH:00"),
                    networkLatency: "無法取得資料",
                    networkLatencyColor: "Danger",
                    networkUploadSpeed: "無法取得資料",
                    networkUploadSpeedColor: "Danger",
                    networkDownloadSpeed: "無法取得資料",
                    networkDownloadSpeedColor: "Danger",
                } as RecordStatusType
            }
        }

        if(records.has(currentTimeFormat)){
            const record = records.get(currentTimeFormat)
            if(record != null && record.DownloadSpeed != null){
                return {
                    networkStatus: "正常",
                    networkStatusColor: "Success",
                    networkTime: currentTime.format("YYYY-MM-DD HH:00"),
                    networkLatency: record.Ping + " ms",
                    networkLatencyColor: record.Ping > 200 ? "Danger" : record.Ping > 100 ? "Warning" : "Success",
                    networkUploadSpeed: record.UploadSpeed + " mbps",
                    networkUploadSpeedColor: record.UploadSpeed < 10 ? "Danger" : record.UploadSpeed < 20 ? "Warning" : "Success",
                    networkDownloadSpeed: record.DownloadSpeed + " mpbs",
                    networkDownloadSpeedColor: record.DownloadSpeed < 10 ? "Danger" : record.DownloadSpeed < 20 ? "Warning" : "Success",
                } as RecordStatusType
            }
        }

        return {
            networkStatus: "檢測中",
            networkStatusColor: "Secondary",
            networkTime: currentTime.format("YYYY-MM-DD HH:00"),
            networkLatency: "檢測中",
            networkLatencyColor: "Secondary",
            networkUploadSpeed: "檢測中",
            networkUploadSpeedColor: "Secondary",
            networkDownloadSpeed: "檢測中",
            networkDownloadSpeedColor: "Secondary",
        } as RecordStatusType
    }

    const getHistoryStatuses = () => {
        const statuses = [] as ("Success" | "Failed" | "Unknown")[]
        for(let key of keys){
            const heartbeat = heartbeats.get(key)
            if(heartbeat != null){
                statuses.push(heartbeat.IsAlive ? "Success" : "Failed")
            }else{
                statuses.push("Unknown")
            }
        }
        return statuses
    }

    useEffect(() => {
        setKeys(generate24HoursKey())
    }, [])

    useEffect(() => {
        fetchRecordsAsync("records").then((recordMap: Map<string, RecordType>) => {
            setRecords(recordMap)
        })
    }, [app])

    useEffect(() => {
        fetchRecordsAsync("heartbeat").then((heartbeat: Map<string, HeartbeatType>) => {
            setHeartbeat(heartbeat)
        })
    }, [app])

    useEffect(() => {
        setLatestNetworkStatus(getLatestNetworkStatus())
    }, [records])

  return (
    <>
    <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand>NTUT-Network-Status</Navbar.Brand>
        </Container>
    </Navbar>
    <Container className='py-5'>
        <h2 className='mb-5 text-center'>即時狀態</h2>
        <Row className='gy-3'>
            { latestNetworkStatus == null ? null : 
                <>
                    <Col md={3} sm={6}>
                        <StatusCard 
                            icon={faWifi} 
                            title={"網路狀態"} 
                            result={latestNetworkStatus.networkStatus} 
                            time={dayjs(keys[0])}
                            status={latestNetworkStatus.networkStatusColor}
                        />
                    </Col>
                    <Col md={3} sm={6}>
                        <StatusCard 
                            icon={faCircleNotch} 
                            title={"延遲狀態"} 
                            result={latestNetworkStatus.networkLatency} 
                            time={dayjs(keys[0])}
                            status={latestNetworkStatus.networkLatencyColor}
                        />
                    </Col>
                    <Col md={3} sm={6}>
                        <StatusCard 
                            icon={faUpload} 
                            title={"上傳速度"} 
                            result={latestNetworkStatus.networkUploadSpeed} 
                            time={dayjs(keys[0])} 
                            status={latestNetworkStatus.networkUploadSpeedColor}
                        />
                    </Col>
                    <Col md={3} sm={6}>
                        <StatusCard
                            icon={faUpload} 
                            title={"下載速度"} 
                            result={latestNetworkStatus.networkDownloadSpeed} 
                            time={dayjs(keys[0])}
                            status={latestNetworkStatus.networkDownloadSpeedColor}
                        />
                    </Col>
                </>
            }
        </Row>
        <div>
            <h2 className='text-center py-5'> 歷史紀錄 </h2>
        </div>
            { heartbeats.size == 0 ? null : 
                <Container>
                    <h4 className='text-center m-0'> 24 小時內歷史觀測狀態</h4>
                    <StatusBar statuses={getHistoryStatuses()}></StatusBar>
                </Container>
            }
        <div>
            <h4 className='text-center m-0'> 歷史延遲狀態（毫秒）</h4>
            <ReactECharts option={getPingOption()} />
        </div>
        <div>
        <h4 className='text-center m-0'> 歷史下載狀態（mbps）</h4>
        <ReactECharts option={getDownloadOption()} />
        </div>
        <div>
            <h4 className='text-center m-0'> 歷史上傳狀態（mbps）</h4>
            <ReactECharts option={getUploadOption()} />
        </div>
    </Container>
    </>
  )
}

export default App
