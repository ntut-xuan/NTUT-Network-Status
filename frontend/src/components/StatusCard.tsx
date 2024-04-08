import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";

export default function StatusCard(props: {
    title: string
    result: string
    time: string
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
            <div className='d-flex flex-row gap-5 my-auto px-3 mx-auto w-100'>
                <div className="w-100 d-flex justify-content-center">
                    <div className='my-auto'>
                        <FontAwesomeIcon icon={icon} size='2x'></FontAwesomeIcon>
                    </div>
                </div>
                <div className="w-100">
                    <p className='fs-4 m-0'> {title} </p>
                    <p className={getStatusTextColor()}> {result} </p>              
                </div>
            </div>
            <div>
                <p className='text-end'><small>測試時間：{testTime}</small></p>
            </div>
        </Card>
    )
}