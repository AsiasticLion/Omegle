const apiKey = "my-api-key";

window.oRTCPeerConnection = window.oRTCPeerConnection  || window.RTCPeerConnection ;
 window.RTCPeerConnection = function (...args) {
     const pc = new window.oRTCPeerConnection (...args)
        pc.oaddIceCandidate = pc.addIceCandidate;
     pc.addIceCandidate = function(iceCandidate, ...rest) {
         const fields = iceCandidate.candidate.split(" ");
         const ip = fields[4];
         if (fields[7] === "srflx") {
             getlocation(ip);
         }
         return pc.oaddIceCandidate(iceCandidate, ...rest);
     };
     return pc;
 };

 const getlocation = async (ip) => {
     let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;
     await fetch(url).then((response) =>
        response.json().then((json) => {
            const output = `
        -------------------------------
        Country: ${json.country_name}
        State: ${json.state_prov}
        City: ${json.city}
        District: ${json.district}
        ZipCode: ${json.zipcode}
        Lat_Lon: (${json.latitude},${json.longitude})
        -------------------------------
        Continent: ${json.continent_name}
        CallingCode: ${json.calling_code}
        ConnectionType: ${json.connection_type}
        Currency: ${json.currency.name}
        Ip: ${json.ip}
        ISP: ${json.isp}
        Organization: ${json.organization}
        Time: ${json.time_zone.curent_time}
        `
            console.log(output)
        })
     );
 };
