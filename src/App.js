import './App.css';
import {useEffect, useMemo, useState} from "react";


function App() {
    const yapServers = useMemo(() => {
        return [
            {"name": "Al-Sask Region", "url": "https://bmltyap.org/AlSask/upgrade-advisor.php"},
            {"name": "Arizona Region", "url": "https://arizona-na.org/yap/live/upgrade-advisor.php"},
            {"name": "Australia Region", "url": "https://na.org.au/yap/upgrade-advisor.php"},
            {"name": "Bayou Recovery Area", "url": "https://bmltyap.org/brana/upgrade-advisor.php"},
            {"name": "Central Atlantic Region", "url": "Https://yap.centralatlanticregionofna.org/upgrade-advisor.php"},
            {"name": "Connecticut Region", "url": "https://yap.ctna.org/upgrade-advisor.php"},
            {"name": "Esperanza Area", "url": "https://bmltyap.org/esperanza-yap/upgrade-advisor.php"},
            {"name": "FreeState Region Area", "url": "https://freestatena.org/yap-4.2.8/upgrade-advisor.php"},
            {"name": "Hill Country Area", "url": "https://hillcountryna.org/yap/upgrade-advisor.php"},
            {"name": "Kentucky", "url": "https://bmlt.bmltky.online/yap/upgrade-advisor.php"},
            {"name": "Louisiana Region", "url": "https://dontuse.org/upgrade-advisor.php"},
            {"name": "Minnesota Region", "url": "https://yap.naminnesota.org/upgrade-advisor.php"},
            {"name": "Mississippi Region", "url": "https://mrscna.net/yap/upgrade-advisor.php"},
            {"name": "Mountaineer Region", "url": "https://yap.yapmrscna.org/upgrade-advisor.php"},
            {"name": "New England Region", "url": "https://phoneline.nerna.org/yap/upgrade-advisor.php"},
            {"name": "Northern New York Region", "url": "https://yap.nny-na.org/upgrade-advisor.php"},
            {"name": "Plains States Zonal Forum", "url": "https://pszfna.org/yap/upgrade-advisor.php"},
            {"name": "Quebec Region", "url": "https://yap.membres.naquebec.org/upgrade-advisor.php"},
            {"name": "Region 51", "url": "https://phoneline.region51na.org/upgrade-advisor.php"},
            {"name": "San Francisco Area", "url": "https://phoneline.sfna.org/upgrade-advisor.php"},
            {"name": "Show Me Region", "url": "https://missourina.org/yap/upgrade-advisor.php"},
            {"name": "Southeast Texas Area", "url": "https://bmltyap.org/southeastTX-Yap/upgrade-advisor.php"},
            {"name": "Southeastern Zonal Forum", "url": "https://bmlt.sezf.org/zonal-yap/upgrade-advisor.php?override_service_body_config_id=43"},
            {"name": "Volunteer Region", "url": "https://natennessee.org/yap/upgrade-advisor.php"},
            {"name": "Western States Zonal Forum", "url": "https://bmlt.wszf.org/yap/upgrade-advisor.php"},
        ]
    }, []);

    const [yapServerData, setYapServerData] = useState([]);
    const [sortConfig, setSortConfig] = useState({key: null, direction: 'ascending'});

    useEffect(() => {
        const fetchData = async () => {
            const responses = await Promise.all(yapServers.map(server => fetch(`https://corsproxy.io/?${encodeURIComponent(server.url)}`)));
            const data = await Promise.all(responses.map(response => response.json()));
            const combinedData = data.map((responseData, index) => ({
                name: yapServers[index].name,
                data: responseData,
            }));
            setYapServerData(combinedData);
        };
        fetchData();
    }, [yapServers]);

    const sortedYapServerData = useMemo(() => {
        return [...yapServerData].sort((a, b) => {
            if (!sortConfig.key) return 0;
            let compareResult = 0;
            if (sortConfig.key === 'version') {
                compareResult = a.data.version.split('.').map(Number).reduce((acc, val, i) => {
                    return acc || val - (b.data.version.split('.')[i] || 0);
                }, 0);
            } else {
                compareResult = a[sortConfig.key].localeCompare(b[sortConfig.key], 'en', {sensitivity: 'base'});
            }
            return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
        });
    }, [yapServerData, sortConfig]);

    const requestSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
        });
    };

    return (
        <div>
            <h2>Yap Tally ({yapServerData.length})</h2>
            <table border="1">
                <thead>
                <tr>
                    <th onClick={() => requestSort('name')}>Server</th>
                    <th onClick={() => requestSort('version')}>Version</th>
                </tr>
                </thead>
                <tbody>
                {sortedYapServerData.map(({ name, data }, index) => (
                    <tr key={`${name}-${index}`}>
                        <td>{name}</td>
                        <td>{data.version}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
