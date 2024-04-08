import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dayjs } from "dayjs";
import { Card } from "react-bootstrap";

export default function StatusCard(props: {
    title: string
    result: string
    time: Dayjs
    icon: IconDefinition
    status: "Success" | "Warning" | "Danger" | "Secondary"
}){
    const icon = props.icon;
    const title = props.title
    const result = props.result
    const testTime = props.time
    const status = props.status

    const getStatusTextColor = () => {
        if(status == "Success"){
            return "text-success"
        }else if(status == "Danger"){
            return "text-danger"
        }else if(status == "Warning"){
            return "text-warning"
        }else if(status == "Secondary"){
            return "text-secondary"
        }
        return ""
    }

    return (
        <Card className='w-100 px-3 pt-3'>
            <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto'>
            <FontAwesomeIcon className='my-auto' icon={icon} size='2x'></FontAwesomeIcon>
            <div>
                <p className='fs-4 m-0'> {title} </p>
                <p className={getStatusTextColor()}> {result} </p>              
            </div>
            </div>
            <div>
            <p className='text-end'><small>測試時間：{testTime.format("YYYY-MM-DD HH:00")}</small></p>
            </div>
        </Card>
    )
}