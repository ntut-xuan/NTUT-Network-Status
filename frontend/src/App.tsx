import { faCircleNotch, faDownload, faUpload, faWifi } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, Col, Container, Navbar, Row } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import "../src/App.css"
import { useEffect, useRef } from 'react';

function App() {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const getPingOption = () => {
    return {
      tooltip: {},
      xAxis: {
        data: ["2024-04-08 09:00:00", "2024-04-08 10:00:00", "2024-04-08 11:00:00", "2024-04-08 12:00:00", "2024-04-08 13:00:00", "2024-04-08 14:00:00"]
      },
      yAxis: {},
      series: [
        {
          name: '延遲速度（毫秒）',
          color: "blue",
          type: 'line',
          data: [5, 8, 40, 20, 7, 9, 12]
        }
      ]
    }
  }

  const getDownloadOption = () => {
    return {
      tooltip: {},
      xAxis: {
        data: ["2024-04-08 09:00:00", "2024-04-08 10:00:00", "2024-04-08 11:00:00", "2024-04-08 12:00:00", "2024-04-08 13:00:00", "2024-04-08 14:00:00"]
      },
      yAxis: {},
      series: [
        {
          name: '下載速度（mbps）',
          type: 'line',
          color: "green",
          data: [200, 198, 196, 50, 140, 160]
        }
      ]
    }
  }

  const getUploadOption = () => {
    return {
      tooltip: {},
      xAxis: {
        data: ["2024-04-08 09:00:00", "2024-04-08 10:00:00", "2024-04-08 11:00:00", "2024-04-08 12:00:00", "2024-04-08 13:00:00", "2024-04-08 14:00:00"]
      },
      yAxis: {},
      series: [
        {
          name: '上傳速度（mbps）',
          type: 'line',
          color: "orange",
          data: [200, 198, 196, 192, 180, 191]
        }
      ]
    }
  }

  useEffect(() => {
    if(scrollRef.current != null){
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [])

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
          <Col md={3} sm={6}>
            <Card className='w-100 px-3 pt-3'>
              <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto'>
                <FontAwesomeIcon className='my-auto' icon={faWifi} size='2x'></FontAwesomeIcon>
                <div>
                  <p className='fs-4 m-0'> 網路狀態 </p>
                  <p className='text-danger'> 測速失敗 </p>              
                </div>
              </div>
              <div>
                <p className='text-end'><small>測試時間：2024-04-08 10:00</small></p>
              </div>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className='w-100 px-3 pt-3'>
              <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto'>
                <FontAwesomeIcon className='my-auto' icon={faCircleNotch} size='2x'></FontAwesomeIcon>
                <div>
                  <p className='fs-4 m-0'> 延遲狀態 </p>
                  <p className='text-danger'> 無法取得資料 </p>              
                </div>
              </div>
              <div>
                <p className='text-end'><small>測試時間：2024-04-08 10:00</small></p>
              </div>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className='w-100 px-3 pt-3'>
              <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto'>
                <FontAwesomeIcon className='my-auto' icon={faUpload} size='2x'></FontAwesomeIcon>
                <div>
                  <p className='fs-4 m-0'> 上傳速度 </p>
                  <p className='text-danger'> 無法取得資料 </p>              
                </div>
              </div>
              <div>
                <p className='text-end'><small>測試時間：2024-04-08 10:00</small></p>
              </div>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className='w-100 px-3 pt-3'>
              <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto'>
                <FontAwesomeIcon className='my-auto' icon={faDownload} size='2x'></FontAwesomeIcon>
                <div>
                  <p className='fs-4 m-0'> 下載速度 </p>
                  <p className='text-danger'> 無法取得資料 </p>              
                </div>
              </div>
              <div>
                <p className='text-end'><small>測試時間：2024-04-08 10:00</small></p>
              </div>
            </Card>
          </Col>
        </Row>
        <div>
          <h2 className='text-center py-5'> 歷史紀錄 </h2>
        </div>
        <Container>
          <h4 className='text-center m-0'> 24 小時內歷史觀測狀態</h4>
          <div className='border rounded p-5 my-5 w-100'>
            <div className='w-100 d-flex flex-row gap-2 overflow-x-auto status-bar' ref={scrollRef}>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-secondary py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-success py-3 rounded'></div>
              <div className='px-1 px-md-2 bg-warning py-3 rounded'></div>
              <div className='w-100 px-1 px-md-2 bg-danger py-3 rounded'>
                <p className='m-0 text-white text-center d-md-block d-lg-block d-none'>
                  <strong>網路測速失敗</strong>
                </p>
              </div>
            </div>
          </div>
        </Container>
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
