<script lang="ts">

</script>

<div class="spinner">
	<div></div>
</div>

<style>
	.spinner {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
	}
	.spinner div {
		width: 50px;
		height: 50px;
		border: 5px solid #ccc;
		border-top-color: #007bff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
