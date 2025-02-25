import React, { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import ConfettiComponent from './../intro/confetti';
import { checkForUpdates, VersionDetails } from './checkforupdates';
import settings from '../../../src/content/_settings.json';

const DevelopmentNotice = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [hasShownConfetti, setHasShownConfetti] = useState(false);
    const [versionDetails, setVersionDetails] = useState(null);
    const [autoupdatecheck, setAutoupdatecheck] = useState(null);
    const [WelMsg, setWelMsg] = useState(null);
    const [hideContent, setHideContent] = useState(false);
    const [showNewPlayer, setShowNewPlayer] = useState(false);
    const [timerRemaining, setTimerRemaining] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch autoupdatecheck from the JSON file
            const jsonAutoupdatecheck = settings?.autoupdatecheck || false;
            setAutoupdatecheck(jsonAutoupdatecheck);

            if (jsonAutoupdatecheck) {
                // Fetch version details only if autoupdatecheck is true
                const details = await checkForUpdates();
                setVersionDetails(details);
            }

            const hasSeenNotice = localStorage.getItem('developmentNotice');
            if (!hasSeenNotice) {
                setShowPopup(true);
            }
        };

        fetchData();
    }, []);

    const handleHidePopup = () => {
        localStorage.setItem('developmentNotice', 'true');
        setIsVerified(true);
        setWelMsg("Make sure to Follow me on Github for more! ❤️");
        setHideContent(true); // Hide existing content
        setShowNewPlayer(true); // Show new Player
        const timeoutDuration = 5000;
        setTimerRemaining(timeoutDuration / 1000);
        const intervalId = setInterval(() => {
            setTimerRemaining((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalId);
            setShowPopup(false);
            setHasShownConfetti(true);
            setWelMsg(null);
            setTimerRemaining(null);
        }, timeoutDuration);
    };

    const handleVerify = (token) => {
        if (token) {
            setIsVerified(true);
        }
    };

    if (!showPopup) {
        return (
            <>
                {hasShownConfetti && isVerified && <ConfettiComponent />}
            </>
        );
    }

    return (
        <div>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)',
                }}
            >
                <div
                    style={{
                        background: 'transparent',
                        color: '#ffffff',
                        padding: '20px',
                        borderRadius: '10px',
                        maxWidth: '400px',
                        textAlign: 'center',
                    }}
                >
                    {showNewPlayer ? (
                        <Player
                            autoplay
                            loop
                            src="/lottie/github.json"
                            style={{ marginBottom: '20px', width: '300px', height: '300px' }}
                        />
                    ) : (
                        <Player
                            autoplay
                            loop
                            src="/lottie/codingdev.json"
                            style={{ marginBottom: '20px', width: '300px', height: '300px' }}
                        />
                    )}
                    {hideContent ? null : (
                        <>
                            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                                Selamat Datang di portfolio Fauzi Bagaswara
                            </p>
                          
                            {!isVerified ? (
                                <>
                                    <div style={{ marginBottom: '10px', marginLeft: '20px' }}>
                                        <HCaptcha
                                            sitekey="d27bf471-6339-4603-b63f-5ab5fdd96ace"
                                            onVerify={handleVerify}
                                        />
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'red', marginBottom: '10px' }}>
                                      Verifikasi bosss
                                    </p>
                                </>
                            ) : null}
                        </>
                    )}
                    {WelMsg && (
                        <div>
                            <h2 style={{ fontSize: '32px', marginBottom: '20px'}}>
                                <span dangerouslySetInnerHTML={{ __html: WelMsg.replace('Github', '<a href="https://github.com/muhammad-fiaz" target="_blank" rel="noopener noreferrer" style="color: #3498db;">Github</a>') }} />
                            </h2>
                            {timerRemaining !== null && (
                                <p style={{ fontSize: '16px', marginBottom: '10px', color: 'linear-gradient(to right, #3498db, #2ecc71)' }}>
                                    Closes in {timerRemaining} seconds.
                                </p>
                            )}
                        </div>
                    )}



                    {!hideContent && (
                        <button
                            onClick={handleHidePopup}
                            disabled={!isVerified}
                            style={{
                                background: 'linear-gradient(to right, #7b68ee, #b22cff)',
                                color: '#ffffff',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                        >
                            I understand
                        </button>
                    )}
                </div>
                {autoupdatecheck && (
                    <div
                        style={{
                            marginTop: '10px',
                            fontSize: '12px',
                            position: 'fixed',
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            textAlign: 'center',
                            padding: '10px',
                        }}
                    >
                    
                    </div>
                )}
            </div>
            {hasShownConfetti && isVerified && <ConfettiComponent />}
        </div>
    );
};

export default DevelopmentNotice;
