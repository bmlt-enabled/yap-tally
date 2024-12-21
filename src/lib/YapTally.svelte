<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import fetchJsonp from 'fetch-jsonp';
	import Servers from './data/servers.json';

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

	const yapServers: YapServer[] = Servers;

	const yapServerData = writable<YapServerData[]>([]);
	let sortDirection = writable(1);

	onMount(async () => {
		const responses = await Promise.allSettled(
			yapServers.map(async (server) => {
				try {
					const url = server.jsonp ? `${server.url}?format=jsonp` : `https://corsproxy.aws.bmlt.app/?url=${encodeURIComponent(server.url)}`;
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
