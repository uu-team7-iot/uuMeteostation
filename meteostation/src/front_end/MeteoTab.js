import React, { useState, useContext } from "react";
import AuthContext from "./utils/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faMapLocationDot, faKey, faWalkieTalkie, faEye, faEyeSlash, faTrashCan } from '@fortawesome/free-solid-svg-icons'


function MeteoTab({ name, locality, access_key, owner, get_meteos, _id }) {

    const { AlertBox } = useContext(AuthContext)

    // states for dotted access key and card flip bool value
    const [dotted, setDotted] = useState(true)
    const [flipped, setFlipped] = useState(false)

    // Front side of meteo tab
    const [nameOrg, setNameOrg] = useState(name)
    const [localityOrg, setLocalityOrg] = useState(locality)
    const [accessKeyOrg, setAccessKeyOrg] = useState(access_key)

    // Back side of meteo tab - changeable
    const [nameTmp, setNameTmp] = useState(name)
    const [localityTmp, setLocalityTmp] = useState(locality)
    const [accessKeyTmp, setAccessKeyTmp] = useState(access_key)

    // states for notification alert box
    const [alertContent, setAlertContent] = useState(null)
    const [openAlert, setOpenAlert] = useState(false);

    function hideAlertBox() {
        setOpenAlert(false)
    }

    function setContentBox(obj) {
        setAlertContent({ msg: obj.msg, success: obj.success })
        setOpenAlert(true)
    }


    const flip_style = {
        transform: flipped ? 'rotateY(180deg)' : 'none'
    }

    async function updateMeteo() {
        const body = { nameOrg, nameTmp, localityTmp, accessKeyTmp, owner }
        const url = '/api/meteostations/update-meteo'
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        }

        try {
            const response = await fetch(url, options);
            const data_json = await response.json();
            console.log(data_json); // handle the response from the server
            if (data_json.success) {
                console.log(data_json)
                console.log(data_json)
                return { success: true, msg: data_json.msg }
            } else {
                console.log(data_json)
                return { success: false, msg: data_json.msg }
            }

        } catch (error) {
            console.log(error)
            return { success: false, msg: error }
        }


    }

    async function deleteMeteo() {
        const url = '/api/meteostations/delete-by-name'
        const payload = JSON.stringify({name: nameOrg})
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: payload
        }

        const res = await fetch(url, options)
        const res_json = await res.json()
        return res_json
    }

    return (
        <>
            {openAlert && <AlertBox success={alertContent.success} msg={alertContent.msg} hideAlertBox={hideAlertBox} />}
            <li class="meteo_tab">
                <div className="flip-card-inner" style={flip_style}>

                    <div class="flip-card-front">
                        <h3>
                            {nameOrg}
                        </h3>
                        <span>
                            <FontAwesomeIcon icon={faMapLocationDot} />
                            {localityOrg}
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faKey} />
                            {dotted ? new Array(accessKeyOrg.length).fill('\u2022') : accessKeyOrg}
                            <button className='toggle_btn' onClick={() => {
                                dotted ? setDotted(false) : setDotted(true)
                                console.log(dotted)
                            }}>
                                <FontAwesomeIcon icon={dotted ? faEyeSlash : faEye} />
                            </button>

                        </span>
                        <span>
                            <FontAwesomeIcon icon={faWalkieTalkie} />
                            {_id}
                        </span>
                        <button className='edit_btn' onClick={() => {
                            setFlipped(true)
                        }}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                            <span>Edit</span>
                        </button>
                    </div>

                    <div class="flip-card-back">
                        <h3>
                            <input type="text" value={nameTmp} onChange={(el) => {
                                setNameTmp(el.target.value)
                            }} />
                        </h3>
                        <span>
                            <FontAwesomeIcon icon={faMapLocationDot} />
                            <input type="text" value={localityTmp} onChange={(el) => {
                                setLocalityTmp(el.target.value)
                            }} />
                        </span>
                        <span>
                            <FontAwesomeIcon icon={faKey} />
                            {dotted ?
                                <input type="text" value={new Array(accessKeyTmp.length).fill('\u2022').join('')} onChange={(el) => {
                                    console.log(el.target.value)
                                    setAccessKeyTmp(el.target.value)
                                }} /> :
                                <input type="text" value={accessKeyTmp} onChange={(el) => {
                                    console.log(el.target.value)
                                    setAccessKeyTmp(el.target.value)
                                }} />}
                            <button className='toggle_btn' onClick={() => {
                                dotted ? setDotted(false) : setDotted(true)
                                console.log(dotted)
                            }}>
                                <FontAwesomeIcon icon={dotted ? faEyeSlash : faEye} />
                            </button>

                        </span>
                        <span>
                            <FontAwesomeIcon icon={faWalkieTalkie} />
                            {_id}
                        </span>
                        <div className="change_btn_div">
                            <button className='cancel_btn' onClick={() => {
                                setFlipped(false)
                                setTimeout(() => {
                                    setNameTmp(nameOrg)
                                    setLocalityTmp(localityOrg)
                                    setAccessKeyTmp(accessKeyOrg)
                                }, 1000)
                            }}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span>Cancel</span>
                            </button>
                            <button className="delete_btn" onClick={async ()=>{
                                const result_val = await deleteMeteo()
                                setContentBox(result_val)
                                if (result_val.success){
                                    get_meteos()
                                }
                            }}>
                                <FontAwesomeIcon icon={faTrashCan} />
                                <span>Delete</span>
                            </button>
                            <button className='confirm_btn' onClick={async () => {
                                const result_val = await updateMeteo()
                                setContentBox(result_val)
                                if (result_val.success) {
                                    setNameOrg(nameTmp)
                                    setLocalityOrg(localityTmp)
                                    setAccessKeyOrg(accessKeyTmp)

                                    setTimeout(() => {
                                        setFlipped(false)
                                    }, 2000)
                                }
                            }
                            }>
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <span>Confirm</span>
                            </button>
                        </div>

                    </div>
                </div>
            </li>

        </>
    )
}

export default MeteoTab

