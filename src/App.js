import './App.css';
import {useEffect, useMemo, useState} from "react";


function App() {
  const yapServers = useMemo(() =>
    {
        return [
            {"name": "Al-Sask Region", "url": "https://bmltyap.org/AlSask/upgrade-advisor.php"},
            {"name": "Connecticut Region", "url": "http://yap.ctna.org/upgrade-advisor.php"},
            {"name": "New England Region", "url": "https://phoneline.nerna.org/yap/upgrade-advisor.php"},
            {"name": "Quebec Region", "url": "https://yap.membres.naquebec.org/upgrade-advisor.php"},
            {"name": "Show Me Region", "url": "https://missourina.org/yap/upgrade-advisor.php"},
            {"name": "Southeastern Zonal Forum", "url": "https://bmlt.sezf.org/zonal-yap/upgrade-advisor.php?override_service_body_config_id=43"},
            {"name": "Volunteer Region", "url": "https://natennessee.org/yap/upgrade-advisor.php"},
            {"name": "Western States Zonal Forum", "url": "https://bmlt.wszf.org/yap/upgrade-advisor.php"},
        ]
    }, []);

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
  }, [yapServers])

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
