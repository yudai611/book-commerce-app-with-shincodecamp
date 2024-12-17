import { getProviders } from "next-auth/react";


//getProviders()メソッドで、現在サインイン用に構成されているプロバイダーのリストを返す。
export const providers = await getProviders().then((res) => {
    console.log(res);
    return res;
});