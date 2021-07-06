<script lang="ts">
	import NoticeBlock from "./NoticeBlock.svelte";
	import FloatingActionButton from "./BottomActionButton.svelte";
	import TopActionButtons from "./TopActionButtons.svelte";
</script>

<main>
	
	<h1>Huanui College Notices</h1>
	<h2>Unofficial notices reader, because your eyes matter.</h2>
	<div class="PrimaryContent">
		<NoticeBlock />
	</div>
	<TopActionButtons/>
	<div class="floatingActionButtonContainer">
		
		<FloatingActionButton externalLink="https://github.com/Fallstop/HCNoticeReader" description="Github Repo">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				fill="var(--text-color)"
				class="bi bi-github"
				viewBox="0 0 16 16"
				id="githubLogo"
				style="margin-top: 22px"
			>
				<path
					d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
				/>
			</svg>
		</FloatingActionButton>
		<FloatingActionButton rightPos="120px" externalLink="https://jmw.nz/" description="Developer's Website">
			<svg stroke="var(--text-color)" viewBox="0 0 199 188" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: 2px;margin-left:1px;">
				<path id="FallstopLogoBW-Octagon" d="M104.519 181.102C101.638 182.294 96.924 182.294 94.043 181.102L41.015 159.138C38.134 157.946 34.801 154.612 33.608 151.732L11.641 98.7C10.448 95.819 10.448 91.105 11.641 88.224L33.607 35.195C34.8 32.314 38.133 28.981 41.014 27.788L94.044 5.821C96.925 4.628 101.639 4.628 104.52 5.821L157.548 27.787C160.429 28.98 163.762 32.313 164.955 35.194L186.922 88.224C188.115 91.105 188.115 95.819 186.922 98.7L164.956 151.731C163.763 154.611 160.43 157.945 157.549 159.137L104.519 181.102Z" stroke-width="8.2"/>
				
				<g  id="FallstopLogoBW-FailingLines">
					<path id="FallstopLogoBW-RightFallingLine" d="M99.281 26.655V85.327" stroke-width="8.2" stroke-linecap="round"/>
					<path id="FallstopLogoBW-CenterFallingLine" d="M129.791 38.39V97.062" stroke-width="8.2" stroke-linecap="round"/>
					<path id="FallstopLogoBW-LeftFallingLine" d="M68.771 38.39V97.062" stroke-width="8.2" stroke-linecap="round"/>
				</g>
				
				<g id="FallstopLogoBW-Text" fill="var(--text-color)">
					<path id="FallstopLogoBW-S" d="M72.12 151.775C72.12 154.551 70.745 155.939 67.994 155.939H54.306C51.574 155.939 50.208 154.551 50.208 151.775V140.913H57.008V150.203H65.32V141.263L51.69 128.334C50.702 127.383 50.208 126.169 50.208 124.694V114.56C50.208 111.765 51.574 110.367 54.306 110.367H67.994C70.745 110.367 72.12 111.746 72.12 114.502V124.694H65.32V116.104H57.008V124.345L70.638 137.217C71.626 138.149 72.12 139.381 72.12 140.914V151.775V151.775Z" />
					<path id="FallstopLogoBW-T" d="M97.288 116.394H89.79V155.939H83.019V116.394H75.521V110.366H97.288V116.394Z"/>
					<path id="FallstopLogoBW-O" d="M123.676 151.775C123.676 154.551 122.3 155.939 119.549 155.939H104.786C102.093 155.939 100.746 154.551 100.746 151.775V114.559C100.746 111.764 102.092 110.366 104.786 110.366H119.549C122.3 110.366 123.676 111.764 123.676 114.559V151.775ZM116.875 150.085V116.219H107.546V150.085H116.875Z"/>
					<path id="FallstopLogoBW-P" d="M151.109 135.176C151.109 138.01 149.724 139.428 146.953 139.428H135.939V155.939H129.139V110.366H146.953C149.724 110.366 151.109 111.764 151.109 114.559V135.176V135.176ZM144.251 133.575V116.22H135.939V133.575H144.251Z"/>
				</g>
				</svg>
				
		</FloatingActionButton>
	</div>
	
</main>

<style lang="scss">
	@import "global.css";
	@import "vars.scss";

	#githubLogo {
		transform: scale(2);
	}
	main {
		transition: all 0.3s ease;
		color: var(--text-color);
		max-width: none;
		
		// overflow-x: hidden;
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		
		h1 {
			text-align: center;
			text-transform: uppercase;
			font-size: 4rem;
			font-weight: 100;
			margin-bottom: 0;
		}
		h2 {
			text-align: center;
			font-weight: bold;
		}
		.PrimaryContent {
			margin: 2em 0;
			background-color: var(--primary-background);
			// box-shadow: 1px 1px 8px var(--drop-down-shadow) 1px;
			border-radius: 1em;
			// background: #e0e0e0;
			box-shadow:  20px 20px 60px var(--primary-background-darker),
						-20px -20px 60px var(--primary-background-lighter);
			width: 80%;
		}
	}

	@media (max-width: 640px) {
		main {
			padding: 0;
			h1 {
				font-size: 2rem;
			}
			.PrimaryContent {
				width: 100vw;
				margin: 0;
			}
		}
		.floatingActionButtonContainer {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-evenly;
			@media (max-width: 640px) {
				flex-wrap: wrap;
				width: 50vw;
			}
		}
	}
	
	@media print {
		main {
			display: block;
			padding: 0;
			margin: 1cm;
			.PrimaryContent {
				max-width: 100vw;
				width: auto;
				margin: 0;
				border: none !important;
            	border-radius: 0 !important;
				box-shadow: none;
			}
		}
		* :not(.PrimaryContent) {
			display: none !important;
		}
	}
</style>
