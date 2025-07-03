window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
	// FIDELITY MAPPING
	const fidelityMap = {
		low: 1,
		standard: 1.5,
		high: 2,
	};

	// DYNAMIC VALUES
	html = html.value ?? "No HTML set.";
	fileName = fileName.value ?? "file";
	format = format.value ?? "a4";
	zoom = zoom.value ?? "1";
	orientation = orientation.value ?? "portrait";
	margin = margin.value ?? "0";
	breakBefore = breakBefore.value ? breakBefore.value.split(",") : [];
	breakAfter = breakAfter.value ? breakAfter.value.split(",") : [];
	breakAvoid = breakAvoid.value ? breakAvoid.value.split(",") : [];
	quality = fidelityMap[fidelity.value] ?? 1.5;
	customDimensions = customDimensions.value ? customDimensions.value.split(",").map(Number) : null;

	// DOCUMENT DIMENSIONS
	const formatDimensions = {
		a0: [4967, 7022],
		a1: [3508, 4967],
		a2: [2480, 3508],
		a3: [1754, 2480],
		a4: [1240, 1754],
		a5: [874, 1240],
		a6: [620, 874],
		a7: [437, 620],
		a8: [307, 437],
		a9: [219, 307],
		a10: [154, 219],
		b0: [5906, 8350],
		b1: [4175, 5906],
		b2: [2953, 4175],
		b3: [2085, 2953],
		b4: [1476, 2085],
		b5: [1039, 1476],
		b6: [738, 1039],
		b7: [520, 738],
		b8: [366, 520],
		b9: [260, 366],
		b10: [183, 260],
		c0: [5415, 7659],
		c1: [3827, 5415],
		c2: [2705, 3827],
		c3: [1913, 2705],
		c4: [1352, 1913],
		c5: [957, 1352],
		c6: [673, 957],
		c7: [478, 673],
		c8: [337, 478],
		c9: [236, 337],
		c10: [165, 236],
		dl: [650, 1299],
		letter: [1276, 1648],
		government_letter: [1199, 1577],
		legal: [1276, 2102],
		junior_legal: [1199, 750],
		ledger: [2551, 1648],
		tabloid: [1648, 2551],
		credit_card: [319, 508],
	};

	// GET FINAL DIMESIONS FROM SELECTED FORMAT
	const dimensions = customDimensions || formatDimensions[format];
	const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

	// LOG SETTINGS TO CONSOLE
	console.log(
		`Filename: ${fileName}\n` +
			`Format: ${format}\n` +
			`Dimensions: ${dimensions}\n` +
			`Zoom: ${zoom}\n` +
			`Final Dimensions: ${finalDimensions}\n` +
			`Orientation: ${orientation}\n` +
			`Margin: ${margin}\n` +
			`Break before: ${breakBefore}\n` +
			`Break after: ${breakAfter}\n` +
			`Break avoid: ${breakAvoid}\n` +
			`Quality: ${quality}`
	);

	const customCSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
 
	body {
		margin: 0!important;
		font-family: "Roboto", sans-serif;
		background-color: #f8f9fa;
	}

	.header {
		background: #1C002E;
		padding: 16px 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.logo {
		width: 40px;
		height: 40px;
		background: #FFFFFF;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		font-weight: 700;
		color: #1C002E;
	}

	.header-text {
		color: #FFFFFF;
		font-size: 18px;
		font-weight: 600;
		margin: 0;
	}

	.header-subtitle {
		color: rgba(255, 255, 255, 0.8);
		font-size: 14px;
		font-weight: 400;
		margin: 0;
		margin-top: 2px;
	}

	button#download {
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		line-height: 1.5rem;
		color: #1C002E;
		border: none;
		font-family: "Roboto", sans-serif;
		padding: 12px 20px;
		background: #FFFFFF;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 8px;
	}

	button#download:hover {
		background: #f8f9fa;
		transform: translateY(-1px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	button#download.downloading {
		color: #666;
		background: #f0f0f0;
		cursor: not-allowed;
	}

	button#download.done {
		color: #22c55e;
		background: #f0fdf4;
		border: 1px solid #22c55e;
	}

	.content-wrapper {
		padding: 24px;
		max-width: 1200px;
		margin: 0 auto;
	}

	#content {
		background: #FFFFFF;
		border-radius: 12px;
		padding: 32px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	::-webkit-scrollbar {
		width: 6px;
		background-color: rgb(0 0 0 / 5%);
	}

	::-webkit-scrollbar-thumb {
		background-color: rgb(0 0 0 / 20%);
		border-radius: 3px;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: rgb(0 0 0 / 30%);
	}
	`;

	// HTML THAT IS RETURNED AS A RENDERABLE URL
	const originalHTML = `
	<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.2/html2pdf.bundle.min.js"></script>
	<style>${customCSS}</style>
	<div class="main">
		<div class="header">
			<div class="header-left">
				<div class="logo">A</div>
				<div>
					<div class="header-text">Allusio PDF Generator</div>
					<div class="header-subtitle">Ready to download your document</div>
				</div>
			</div>
			<button id="download">
				<span>📄</span>
				<span>Download PDF</span>
			</button>
		</div>
		<div class="content-wrapper">
			<div id="content">${html}</div>
		</div>
	</div>
	<script>
	document.getElementById('download').addEventListener('click', function() {
		var element = document.getElementById('content');
		var button = this;
		var buttonText = button.querySelector('span:last-child');
		var buttonIcon = button.querySelector('span:first-child');
		
		buttonIcon.innerText = '⏳';
		buttonText.innerText = 'Processing...';
		button.className = 'downloading';

		var opt = {
			pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
			margin: ${margin},
			filename: '${fileName}',
			html2canvas: {
				useCORS: true,
				scale: ${quality}
			},
			jsPDF: {
				unit: 'px',
				orientation: '${orientation}',
				format: [${finalDimensions}],
				hotfixes: ['px_scaling']
			}
		};
		
		html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
			buttonIcon.innerText = '✅';
			buttonText.innerText = 'Download Complete';
			button.className = 'done';
			setTimeout(function() { 
				buttonIcon.innerText = '📄';
				buttonText.innerText = 'Download PDF';
				button.className = ''; 
			}, 3000);
		}).save();
	});
	</script>
	`;
	var encodedHtml = encodeURIComponent(originalHTML);
	return "data:text/html;charset=utf-8," + encodedHtml;
};
