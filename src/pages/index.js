import Layout from '../components/Layout';
import Link from 'next/link';
import "./style.css";
import ProtectedPage from './protected';

export default function Home({ templates }) {
  
  return (
    <ProtectedPage>
      <Layout>
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
      </Layout>
    </ProtectedPage>
  );
}

// Fetch data at server side using getServerSideProps
export async function getServerSideProps() {
  const res = await fetch('http://localhost:3001/api/templates');
  const templates = await res.json();

  return {
    props: {
      templates,
    },
  };
}
