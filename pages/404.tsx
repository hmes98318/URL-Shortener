import React from 'react';
import Script from "next/script";


const Custom404 = () => {
    return (<>
        <Script>
            {`document.location.href='/';`}
        </Script>
    </>);
}
export default Custom404;