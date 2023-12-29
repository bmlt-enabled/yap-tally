import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";


function App() {
  let yapServers = [
      {"name":"SEZF","url":"https://bmlt.sezf.org/zonal-yap/upgrade-advisor.php?override_service_body_config_id=43"},
      {"name":"Archsearch","url":"https://archsearch.org/yap-4.3.0-beta1/upgrade-advisor.php"}
  ]

  const [yapServerData, setYapServerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        const responses = await Promise.all(yapServers.map(server => fetch(`https://corsproxy.io/?${encodeURIComponent(server.url)} `)));
        const data = await Promise.all(responses.map(response => response.json()));

        const combinedData = data.map((responseData, index) => ({
            name: yapServers[index].name,
            data: [responseData],
        }));

        setYapServerData(combinedData)
    }

    fetchData()
  }, [])

  return (
      <div>
          <h2>Yap Tally</h2>
          <table border={1}>
              <thead>
              <tr>
                  <th>Server</th>
                  <th>Version</th>
                  {/* Add more table headers if needed */}
              </tr>
              </thead>
              <tbody>
              {yapServerData.map(({ name, data }) => (
                  data.map((serverData) => (
                      <tr key={name}>
                          <td>{name}</td>
                          <td>{serverData.version}</td>
                          {/* Add more table cells if needed */}
                      </tr>
                  ))
              ))}
              </tbody>
          </table>
      </div>
  );
}

export default App;
