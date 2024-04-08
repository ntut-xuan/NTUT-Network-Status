import { useEffect, useRef } from "react"

export default function StatusBar(props: {
    statuses: ("Success" | "Failed" | "Unknown")[]
}){
    const statuses = props.statuses;
    const scrollRef = useRef<HTMLDivElement | null>(null)

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
        if(scrollRef.current != null){
          scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [scrollRef])

    return (
        <div className='border rounded p-5 my-5 w-100'>
            <div className='w-100 d-flex flex-row gap-2 overflow-x-auto status-bar' ref={scrollRef}>
                {
                    statuses.slice(0, statuses.length - 1).map((status) => {
                        return (
                            <div className={`px-1 px-md-2 ${getStatusBackgroundColor(status)} py-3 rounded`}></div>
                        )
                    })
                }
                {
                    <div className={`px-1 px-md-2 ${getStatusBackgroundColor(statuses.slice(-1)[0])} py-3 rounded w-100`}>
                        <p className='m-0 text-white text-center d-md-block d-lg-block d-none'>
                            <strong>{getStatusText(statuses.slice(-1)[0])}</strong>
                        </p>
                    </div>
                }
            </div>
        </div>
    )
}