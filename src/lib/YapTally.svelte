<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import fetchJsonp from 'fetch-jsonp';

	interface YapServer {
		name: string;
		url: string;
		jsonp?: boolean;
	}

	interface ServerData {
		version: string;
	}

	interface YapServerData {
		name: string;
		data: ServerData[];
	}

	const yapServers: YapServer[] = [
		{ name: 'Al-Sask Region', url: 'https://bmltyap.org/AlSask/upgrade-advisor.php', jsonp: true },
		{ name: 'Arizona Region', url: 'https://arizona-na.org/yap/live/upgrade-advisor.php' },
		{ name: 'Australia Region', url: 'https://na.org.au/yap/upgrade-advisor.php' },
		{ name: 'Bayou Recovery Area', url: 'https://bmltyap.org/brana/upgrade-advisor.php', jsonp: true },
		{ name: 'Canadian Assembly', url: 'https://canaacna.org/yap/upgrade-advisor.php', jsonp: true },
		{ name: 'Central Atlantic Region', url: 'https://yap.centralatlanticregionofna.org/upgrade-advisor.php', jsonp: true },
		{ name: 'Connecticut Region', url: 'https://yap.ctna.org/upgrade-advisor.php' },
		{ name: 'Esperanza Area', url: 'https://bmltyap.org/esperanza-yap/upgrade-advisor.php', jsonp: true },
		{ name: 'FreeState Region Area', url: 'https://freestatena.org/yap-4.2.8/upgrade-advisor.php' },
		{ name: 'Hill Country Area', url: 'https://hillcountryna.org/yap/upgrade-advisor.php' },
		{ name: 'Kentucky', url: 'https://bmlt.bmltky.online/yap/upgrade-advisor.php' },
		{ name: 'Louisiana Region', url: 'https://dontuse.org/upgrade-advisor.php' },
		{ name: 'Mississippi Region', url: 'https://mrscna.net/yap/upgrade-advisor.php', jsonp: true },
		{ name: 'Mountaineer Region', url: 'https://yap.yapmrscna.org/upgrade-advisor.php' },
		{ name: 'New England Region', url: 'https://phoneline.nerna.org/yap/upgrade-advisor.php' },
		{ name: 'Northern New York Region', url: 'https://yap.nny-na.org/upgrade-advisor.php', jsonp: true },
		{ name: 'Plains States Zonal Forum', url: 'https://pszfna.org/yap/upgrade-advisor.php' },
		{ name: 'Region 51', url: 'https://phoneline.region51na.org/upgrade-advisor.php', jsonp: true },
		{ name: 'San Francisco Area', url: 'https://phoneline.sfna.org/upgrade-advisor.php', jsonp: true },
		{ name: 'Show Me Region', url: 'https://missourina.org/yap/upgrade-advisor.php' },
		{ name: 'Southeast Texas Area', url: 'https://bmltyap.org/southeastTX-Yap/upgrade-advisor.php', jsonp: true },
		{ name: 'Southeastern Zonal Forum', url: 'https://bmlt.sezf.org/zonal-yap/upgrade-advisor.php?override_service_body_config_id=43' },
		{ name: 'Volunteer Region', url: 'https://natennessee.org/yap/upgrade-advisor.php' },
		{ name: 'Western States Zonal Forum', url: 'https://bmlt.wszf.org/yap/upgrade-advisor.php' }
	];

	const yapServerData = writable<YapServerData[]>([]);
	let sortDirection = writable(1);

	onMount(async () => {
		const responses = await Promise.allSettled(
			yapServers.map(async (server) => {
				try {
					const url = server.jsonp ? `${server.url}?format=jsonp` : `https://corsproxy.io/?${encodeURIComponent(server.url)}`;
					const response = server.jsonp ? await fetchJsonp(url) : await fetch(url);
					return response.json();
				} catch {
					return { version: 'error' };
				}
			})
		);

		const data = responses.map((response, index) => ({
			name: yapServers[index].name,
			data: response.status === 'fulfilled' ? [response.value] : [{ version: 'error' }]
		}));

		yapServerData.set(data);
	});

	function compareVersions(versionA: string, versionB: string): number {
		const a = versionA.split('.').map(Number);
		const b = versionB.split('.').map(Number);

		for (let i = 0; i < Math.max(a.length, b.length); i++) {
			if ((a[i] || 0) > (b[i] || 0)) return 1;
			if ((a[i] || 0) < (b[i] || 0)) return -1;
		}
		return 0;
	}

	function sortByField(field: 'name' | 'version') {
		yapServerData.update((data) => {
			const sortedData = [...data].sort((a, b) => {
				if (field === 'name') {
					return a.name.localeCompare(b.name) * $sortDirection;
				} else if (field === 'version') {
					const versionA = a.data[0]?.version || '0.0.0';
					const versionB = b.data[0]?.version || '0.0.0';
					return compareVersions(versionA, versionB) * $sortDirection;
				}
				return 0;
			});
			sortDirection.set($sortDirection * -1);
			return sortedData;
		});
	}
</script>

<div id="main">
	<h2>Yap Tally</h2>
	<table>
		<thead>
			<tr>
				<th on:click={() => sortByField('name')}>Server</th>
				<th on:click={() => sortByField('version')}>Version</th>
			</tr>
		</thead>
		<tbody>
			{#each $yapServerData as { name, data }}
				{#each data as serverData}
					<tr>
						<td>{name}</td>
						<td>{serverData.version !== undefined ? serverData.version : 'Error'}</td>
					</tr>
				{/each}
			{/each}
		</tbody>
	</table>
</div>
