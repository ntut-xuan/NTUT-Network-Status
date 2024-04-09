import { faCircleNotch, faDownload, faUpload, faWifi } from '@fortawesome/free-solid-svg-icons';
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
    const [wifiRecords, setWiFiRecords] = useState<Map<string, (RecordType | null)>>(new Map())
    const [wifiHeartbeats, setWiFiHeartbeats] = useState<Map<string, (HeartbeatType | null)>>(new Map())
    const [latestCableNetworkStatus, setLatestCableNetworkStatus] = useState<RecordStatusType | null>(null)
    const [latestWiFiNetworkStatus, setLatestWiFiNetworkStatus] = useState<RecordStatusType | null>(null)
    const [keys, setKeys] = useState<string[]>([])

    const getPingOption = () => {
        return {
            tooltip: {},
            xAxis: {
                type: "category",
                data: keys
            },
            yAxis: {},
            series: [
                {
                    name: '有線網路延遲速度（毫秒）',
                    type: 'line',
                    color: "red",
                    data: Array.from(records.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].Ping];
                    })
                },
                {
                    name: '無線網路延遲速度（毫秒）',
                    type: 'line',
                    color: "blue",
                    data: Array.from(wifiRecords.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].Ping];
                    })
                }
            ],
            legend: {
                show: true
            }
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
                    name: '有線網路下載速度（mbps）',
                    type: 'line',
                    color: "red",
                    data: Array.from(records.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].DownloadSpeed];
                    })
                },
                {
                    name: '無線網路下載速度（mbps）',
                    type: 'line',
                    color: "blue",
                    data: Array.from(wifiRecords.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].DownloadSpeed];
                    })
                }
            ],
            legend: {
                show: true
            }
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
                    name: '有線網路上傳速度（mbps）',
                    type: 'line',
                    color: "red",
                    data: Array.from(records.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].UploadSpeed];
                    })
                },
                {
                    name: '無線網路上傳速度（mbps）',
                    type: 'line',
                    color: "blue",
                    data: Array.from(wifiRecords.entries()).reverse().map((record) => {
                        return record[1] == null ? [record[0], 0] : [record[0], record[1].UploadSpeed];
                    })
                }
            ],
            legend: {
                show: true
            }
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

    const getLatestNetworkStatus = (heartbeats: Map<string, (HeartbeatType | null)>, records: Map<string, (RecordType | null)>) => {
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
                    networkUploadSpeed: record.UploadSpeed.toFixed(2) + " mbps",
                    networkUploadSpeedColor: record.UploadSpeed < 10 ? "Danger" : record.UploadSpeed < 20 ? "Warning" : "Success",
                    networkDownloadSpeed: record.DownloadSpeed.toFixed(2) + " mpbs",
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

    const getHistoryStatuses = (heartbeats: Map<string, (HeartbeatType | null)>) => {
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
        setKeys(generate24HoursKey().reverse())
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
        fetchRecordsAsync("wifi-record").then((recordMap: Map<string, RecordType>) => {
            setWiFiRecords(recordMap)
        })
    }, [app])

    useEffect(() => {
        fetchRecordsAsync("wifi-heartbeat").then((heartbeat: Map<string, HeartbeatType>) => {
            setWiFiHeartbeats(heartbeat)
        })
    }, [app])

    useEffect(() => {
        setLatestCableNetworkStatus(getLatestNetworkStatus(heartbeats, records))
    }, [heartbeats, records])

    useEffect(() => {
        setLatestWiFiNetworkStatus(getLatestNetworkStatus(wifiHeartbeats, wifiRecords))
    }, [wifiHeartbeats, wifiRecords])

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
            { latestCableNetworkStatus == null ? null : 
                <>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faWifi} 
                            iconColor={"Danger"}
                            title={"有線網路狀態"} 
                            result={latestCableNetworkStatus.networkStatus} 
                            time={latestCableNetworkStatus.networkTime}
                            status={latestCableNetworkStatus.networkStatusColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faCircleNotch} 
                            iconColor={"Danger"}
                            title={"有線網路延遲狀態"} 
                            result={latestCableNetworkStatus.networkLatency} 
                            time={latestCableNetworkStatus.networkTime}
                            status={latestCableNetworkStatus.networkLatencyColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faUpload} 
                            iconColor={"Danger"}
                            title={"有線網路上傳速度"} 
                            result={latestCableNetworkStatus.networkUploadSpeed} 
                            time={latestCableNetworkStatus.networkTime} 
                            status={latestCableNetworkStatus.networkUploadSpeedColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard
                            icon={faDownload} 
                            iconColor={"Danger"}
                            title={"有線網路下載速度"} 
                            result={latestCableNetworkStatus.networkDownloadSpeed} 
                            time={latestCableNetworkStatus.networkTime}
                            status={latestCableNetworkStatus.networkDownloadSpeedColor}
                        />
                    </Col>
                </>
            }
            { latestWiFiNetworkStatus == null ? null : 
                <>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faWifi} 
                            iconColor={"Primary"}
                            title={"無線網路狀態"} 
                            result={latestWiFiNetworkStatus.networkStatus} 
                            time={latestWiFiNetworkStatus.networkTime}
                            status={latestWiFiNetworkStatus.networkStatusColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faCircleNotch} 
                            iconColor={"Primary"}
                            title={"無線網路延遲狀態"} 
                            result={latestWiFiNetworkStatus.networkLatency} 
                            time={latestWiFiNetworkStatus.networkTime}
                            status={latestWiFiNetworkStatus.networkLatencyColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard 
                            icon={faUpload} 
                            iconColor={"Primary"}
                            title={"無線網路上傳速度"} 
                            result={latestWiFiNetworkStatus.networkUploadSpeed} 
                            time={latestWiFiNetworkStatus.networkTime} 
                            status={latestWiFiNetworkStatus.networkUploadSpeedColor}
                        />
                    </Col>
                    <Col xxl={3} lg={6} md={6} sm={6}>
                        <StatusCard
                            icon={faDownload} 
                            iconColor={"Primary"}
                            title={"無線網路下載速度"} 
                            result={latestWiFiNetworkStatus.networkDownloadSpeed} 
                            time={latestWiFiNetworkStatus.networkTime}
                            status={latestWiFiNetworkStatus.networkDownloadSpeedColor}
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
                    <StatusBar cableStatuses={getHistoryStatuses(heartbeats)} wifiStatuses={getHistoryStatuses(wifiHeartbeats)}></StatusBar>
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
