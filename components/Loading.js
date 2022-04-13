import React from 'react';
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
    return (<center style={{display: 'grid', placeItems: "center", height: "100vh"}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: "center"}}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" height={180}
                 style={{marginBottom: 30}} alt="Loader"/>
            <HashLoader
                color={"#3CBC28"} loading={true} size={30}/>
        </div>
    </center>);
};

export default Loading;
