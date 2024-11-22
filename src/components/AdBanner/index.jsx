import { useEffect } from "react";

const AdBanner = (props) => {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID, "client id");
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{
        display: "block",
        overflow: "hidden",
      }}
      data-ad-client="ca-pub-4374900296081612"
      {...props}
    />
  );
};
export default AdBanner;