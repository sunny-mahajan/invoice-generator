// import { useSession, signIn, signOut } from 'next-auth/react';

// export default function HomePage() {
//   const { data: session, status } = useSession();

//   if (status === 'loading') {
//     return <div>Loading...</div>;
//   }

//   if (session) {
//     return (
//       <div>
//         <p>Welcome, {session.user.name}</p>
//         <button onClick={() => signOut()}>Sign out</button>
//       </div>
//     );
//   }
  
//   return (
//     <div>
//       <p>You are not signed in</p>
//       <button onClick={() => signIn()}>Sign in</button>
//     </div>
//   );
// }


import Link from 'next/link';
import "./style.css";

export default function Home({ templates }) {

  const handlePreview = (template) => {
  };

  const handleDownloadCSV = (template) => {
    const csvData = `Template Id,Invoice No.,Invoice Issue Date,Invoice Due Date,Sender's Company Name,Sender's Name,Sender's Address,Sender's City,Sender's State,Sender's Zipcode,Sender's Contact No,Sender's Email,Sender's Bank,Sender's Account no,Receiver's Company Name,Receiver's Name,Receiver's Address,Receiver's City,Receiver's State,Receiver's Zipcode,Receiver's Contact No,Receiver's email,Remarks,Item name,Item quantity,Item price\nTPL001,INV-1,8/27/2024,8/30/2024,TEST LLC,Harry,addr1,city1,state1,zip1,1234567890,sender1@email.com,Acorda Bank,54687582,UAT LLC,Messi,Raddr1,Rcity1,Rstate1,Rzip1,5489652580,receiver1@email.com,Thank you.,a,2,20\n,,,,,,,,,,,,,,,,,,,,,,,b,5,30\n,,,,,,,,,,,,,,,,,,,,,,,c,7,50\n,,,,,,,,,,,,,,,,,,,,,,,d,5,40\nTPL001,INV-2,8/28/2024,8/31/2024,DEMO LLC,Andy,addr2,city2,state2,zip1,4567894250,sender2@email.com,Wells Fargo,87652158,QA LLC,Ronaldo,Raddr2,Rcity2,Rstate2,Rzip2,4568756980,receiver2@email.com,Please pay before due date. Thanks.,e,6,10\n,,,,,,,,,,,,,,,,,,,,,,,f,5,80\n,,,,,,,,,,,,,,,,,,,,,,,g,1,90\n,,,,,,,,,,,,,,,,,,,,,,,h,7,70
    `.trim(); // Trim to remove any leading/trailing whitespace
  
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `invoice_template_${template.id}.csv`);
    a.click();
  };
  
  
  
  return (

    <div className="content d-flex flex-direction-column">
        <div className="topbar d-flex flex-direction-row align-items-center justify-content-between">
        <div
            className="topbar-left"
            style={{
                gap: "8px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h1>Templates</h1>
        </div>
        <div className="topbar-right d-flex flex-direction-row align-items-center justify-content-between">
            <div className="topbar-filter">
            </div>
        </div>
        </div>
        <div
        className="main-content-wrap d-flex flex-direction-column justify-content-center align-items-center"
        style={{
            height: "100%",
        }}
        >
        
        <div className="w-100 invoices-list">
            {templates.map((template) => (
                <div key={template.id} className="invoice-list-item d-flex justify-content-start align-items-center">
                    <div className="invoice-list-item-id">
                        {" "}
                        <span
                        style={{
                            color: "#7e88c3",
                        }}
                        >
                        #
                        </span>
                        {template.id || "-"}
                    </div>
                    <div className="invoice-list-item-name">
                        {template.name || "-"}
                    </div>
                    <button onClick={() => handlePreview(template)}>Preview</button>
                    <button onClick={() => handleDownloadCSV(template)}>Download CSV</button>
                </div>
            ))}
            </div>
        </div>
    </div>
  );
}

// Fetch data at server side using getServerSideProps
export async function getServerSideProps() {
  const res = await fetch('http://localhost:3000/api/templates');
  const templates = await res.json();

  return {
    props: {
      templates,
    },
  };
}
