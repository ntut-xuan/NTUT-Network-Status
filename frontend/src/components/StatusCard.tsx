import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "react-bootstrap";

export default function StatusCard(props: {
    title: string
    result: string
    time: string
    icon: IconDefinition
    iconColor: "Success" | "Warning" | "Danger" | "Secondary" | "Info" | "Primary"
    status: "Success" | "Warning" | "Danger" | "Secondary"
}){
    const icon = props.icon;
    const iconColor = props.iconColor;
    const title = props.title
    const result = props.result
    const testTime = props.time
    const status = props.status

    const getStatusTextColor = (status: string) => {
        if(status == "Success"){
            return "text-success"
        }else if(status == "Danger"){
            return "text-danger"
        }else if(status == "Warning"){
            return "text-warning"
        }else if(status == "Secondary"){
            return "text-secondary"
        }else if(status == "Info"){
            return "text-info"
        }else if(status == "Primary"){
            return "text-primary"
        }
        return ""
    }

    return (
        <Card className='w-100 px-3 pt-3'>
            <div className='d-flex flex-row gap-5 my-auto ps-3 mx-auto w-100'>
                <div className="w-25 d-flex justify-content-center">
                    <div className='my-auto'>
                        <FontAwesomeIcon className={`${getStatusTextColor(iconColor)}`} icon={icon} size='2x'></FontAwesomeIcon>
                    </div>
                </div>
                <div className="w-100">
                    <p className='fs-5 m-0'> {title} </p>
                    <p className={getStatusTextColor(status)}> {result} </p>              
                </div>
            </div>
            <div>
                <p className='text-end'><small>測試時間：{testTime}</small></p>
            </div>
        </Card>
    )
}