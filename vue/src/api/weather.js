import request from '@/utils/request'

 
 
// // 需要传参
export function getData(lat,lon) {
    //console.log(data)
    const params= {
        latitude: lat,
        longitude: lon
    }
    console.log(params)

    return request({
        url: "/weather/getWeather",
        headers: { "Access-Control-Allow-Origin": "*" },
        methods: "get",
        params
    });
}
 