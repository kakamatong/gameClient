export interface LOGIN_INFO {
    username: string;
    userid: number;
    password: string;
    server: string;
    loginType: string;
    token: string;
    subid:number;
}

// nickname 0 : string
// headurl 1 : string
// sex 2 : integer
// province 3 : string
// city 4 : string
// ip 5 : string
// ext 6 : string
export interface USER_DATA {
    userid: number;
    nickname: string;
    headurl: string;
    sex: number;
    province: string;
    city: string;
    ip: string;
    ext: string;
}