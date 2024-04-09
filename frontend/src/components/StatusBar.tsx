import { useEffect, useRef } from "react"

export default function StatusBar(props: {
    cableStatuses: ("Success" | "Failed" | "Unknown")[]
    wifiStatuses: ("Success" | "Failed" | "Unknown")[]
}){
    const cableStatuses = props.cableStatuses;
    const wifiStatuses = props.wifiStatuses;
    const cableScrollRef = useRef<HTMLDivElement | null>(null)
    const wifiScrollRef = useRef<HTMLDivElement | null>(null)

    const getStatusBackgroundColor = (status: string) => {
        if(status == "Success"){
            return "bg-success"
        }
        if(status == "Failed"){
            return "bg-danger"
        }
        if(status == "Unknown"){
            return "bg-secondary"
        }
    }

    const getStatusText = (status: string) => {
        if(status == "Success"){
            return "網路狀態正常"
        }
        if(status == "Failed"){
            return "網路測速失敗"
        }
        if(status == "Unknown"){
            return "正在測速或未運行測速"
        }
    }

    useEffect(() => {
        if(cableScrollRef.current != null){
            cableScrollRef.current.scrollLeft = cableScrollRef.current.scrollWidth
        }
    }, [cableScrollRef])

    useEffect(() => {
        if(wifiScrollRef.current != null){
            wifiScrollRef.current.scrollLeft = wifiScrollRef.current.scrollWidth
        }
    }, [wifiScrollRef])

    return (
        <div className='border rounded p-5 my-5 w-100 d-flex flex-column gap-3'>
            <div className='w-100 d-flex flex-row gap-2 status-bar'>
                <div className="px-3 my-auto">
                    <p className="text-nowrap m-0"> 有線網路</p>
                </div>
                <div className="overflow-x-auto d-flex flex-row gap-2 w-100" ref={cableScrollRef}>
                {
                    cableStatuses.slice(0, cableStatuses.length - 1).map((status) => {
                        return (
                            <div className={`px-1 px-md-2 ${getStatusBackgroundColor(status)} py-3 rounded`}></div>
                        )
                    })
                }
                {
                    <div className={`px-1 px-md-2 ${getStatusBackgroundColor(cableStatuses.slice(-1)[0])} py-3 rounded w-100`}>
                        <p className='m-0 text-white text-center d-md-block d-lg-block d-none'>
                            <strong>{getStatusText(cableStatuses.slice(-1)[0])}</strong>
                        </p>
                    </div>
                }
                </div>
            </div>
            <div className='w-100 d-flex flex-row gap-2 status-bar'>
                <div className="px-3 my-auto">
                    <p className="text-nowrap m-0"> 無線網路</p>
                </div>
                <div className="overflow-x-auto d-flex flex-row gap-2 w-100" ref={wifiScrollRef}>
                {
                    wifiStatuses.slice(0, wifiStatuses.length - 1).map((status) => {
                        return (
                            <div className={`px-1 px-md-2 ${getStatusBackgroundColor(status)} py-3 rounded`}></div>
                        )
                    })
                }
                {
                    <div className={`px-1 px-md-2 ${getStatusBackgroundColor(wifiStatuses.slice(-1)[0])} py-3 rounded w-100`}>
                        <p className='m-0 text-white text-center d-md-block d-lg-block d-none'>
                            <strong>{getStatusText(wifiStatuses.slice(-1)[0])}</strong>
                        </p>
                    </div>
                }
                </div>
            </div>
        </div>
    )
}