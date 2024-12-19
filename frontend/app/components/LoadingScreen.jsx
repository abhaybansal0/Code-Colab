import React from 'react'
import { mirage } from 'ldrs'

mirage.register()


const LoadingScreen = ({ showLoading }) => {
    return (
        <div className={`animateme absolute w-screen h-screen filter  flex justify-center items-center z-40
        ${showLoading ? ' opacity-1 backdrop-blur-md visible' : ' opacity-0 backdrop-blur-0 invisible'}`}>

            <l-mirage
                size="60"
                speed="2.5"
                color="white"
            ></l-mirage>


        </div>
    )
}

export default LoadingScreen
