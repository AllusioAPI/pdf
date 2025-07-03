window.function = function (html, fileName, format, zoom, orientation, margin, breakBefore, breakAfter, breakAvoid, fidelity, customDimensions) {
	try {
		// FIDELITY MAPPING
		const fidelityMap = {
			low: 1,
			standard: 1.5,
			high: 2,
		};

		// DYNAMIC VALUES - Fixed null/undefined handling
		html = html?.value || "No HTML set.";
		fileName = fileName?.value || "document";
		format = format?.value || "a4";
		zoom = parseFloat(zoom?.value) || 1;
		orientation = orientation?.value || "portrait";
		margin = parseInt(margin?.value) || 0;
		
		// Fixed array handling
		breakBefore = breakBefore?.value ? breakBefore.value.split(",").map(s => s.trim()).filter(s => s) : [];
		breakAfter = breakAfter?.value ? breakAfter.value.split(",").map(s => s.trim()).filter(s => s) : [];
		breakAvoid = breakAvoid?.value ? breakAvoid.value.split(",").map(s => s.trim()).filter(s => s) : [];
		
		const quality = fidelityMap[fidelity?.value] || 1.5;
		const customDimensions = customDimensions?.value ? 
			customDimensions.value.split(",").map(d => parseInt(d.trim())).filter(d => !isNaN(d)) : 
			null;

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

		// GET FINAL DIMENSIONS FROM SELECTED FORMAT
		const dimensions = customDimensions || formatDimensions[format] || formatDimensions.a4;
		const finalDimensions = dimensions.map((dimension) => Math.round(dimension / zoom));

		// Validate dimensions
		if (finalDimensions.some(d => d <= 0 || d > 10000)) {
			throw new Error("Invalid dimensions calculated");
		}

		// LOG SETTINGS TO CONSOLE
		console.log(
			`Allusio PDF Generation Settings:\n` +
			`Filename: ${fileName}\n` +
			`Format: ${format}\n` +
			`Dimensions: ${dimensions.join(' x ')}\n` +
			`Zoom: ${zoom}\n` +
			`Final Dimensions: ${finalDimensions.join(' x ')}\n` +
			`Orientation: ${orientation}\n` +
			`Margin: ${margin}px\n` +
			`Break before: ${breakBefore.join(', ')}\n` +
			`Break after: ${breakAfter.join(', ')}\n` +
			`Break avoid: ${breakAvoid.join(', ')}\n` +
			`Quality: ${quality}`
		);

		// ENHANCED CSS WITH BETTER COMPATIBILITY
		const customCSS = `
		@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
		
		* {
			box-sizing: border-box;
		}
		
		body {
			margin: 0 !important;
			padding: 0;
			font-family: 'Inter', 'Roboto', sans-serif;
		}
		
		.main {
			position: relative;
			min-height: 100vh;
		}
		
		.header {
			position: fixed;
			top: 0;
			right: 0;
			z-index: 1000;
			padding: 8px;
		}
		
		button#download {
			border-radius: 0.5rem;
			font-size: 16px;
			font-weight: 600;
			line-height: 1.5rem;
			color: #FFFFFF;
			border: none;
			font-family: "Roboto", "Inter", sans-serif;
			padding: 8px 16px;
			height: 40px;
			background: #1C002E;
			box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08), 0 1px 2.5px rgba(0, 0, 0, 0.1);
			cursor: pointer;
			transition: all 0.2s ease;
			border: 2px solid transparent;
		}
		
		button#download:hover {
			background: #FFFFFF;
			color: #1C002E;
			border: 2px solid #1C002E;
		}
		
		button#download:disabled {
			opacity: 0.6;
			cursor: not-allowed;
		}
		
		button#download.downloading {
			color: #FFFFFF;
			background: #1C002E;
			opacity: 0.8;
		}
		
		button#download.done {
			color: #FFFFFF;
			background: #28a745;
		}
		
		#content {
			padding: 20px;
			padding-top: 60px;
		}
		
		::-webkit-scrollbar {
			width: 6px;
			background-color: rgba(0, 0, 0, 0.08);
		}
		
		::-webkit-scrollbar-thumb {
			background-color: rgba(0, 0, 0, 0.32);
			border-radius: 4px;
		}
		
		@media print {
			.header {
				display: none !important;
			}
			#content {
				padding-top: 0;
			}
		}
		`;

		// ENHANCED HTML WITH BETTER ERROR HANDLING
		const originalHTML = `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Allusio PDF Generator</title>
			<style>${customCSS}</style>
		</head>
		<body>
			<div class="main">
				<div class="header">
					<button id="download">📄 Download PDF</button>
				</div>
				<div id="content">${html}</div>
			</div>
			
			<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
			<script>
			document.addEventListener('DOMContentLoaded', function() {
				const button = document.getElementById('download');
				
				if (!button) {
					console.error('Download button not found');
					return;
				}
				
				button.addEventListener('click', function() {
					const element = document.getElementById('content');
					
					if (!element) {
						console.error('Content element not found');
						return;
					}
					
					// Disable button during processing
					button.disabled = true;
					button.innerText = '🔄 Generating PDF...';
					button.className = 'downloading';
					
					const opt = {
						pagebreak: { 
							mode: ['css', 'legacy'],
							before: ${JSON.stringify(breakBefore)}, 
							after: ${JSON.stringify(breakAfter)}, 
							avoid: ${JSON.stringify(breakAvoid)} 
						},
						margin: ${margin},
						filename: '${fileName}.pdf',
						image: { type: 'jpeg', quality: 0.98 },
						html2canvas: {
							useCORS: true,
							scale: ${quality},
							letterRendering: true,
							allowTaint: true,
							backgroundColor: '#ffffff'
						},
						jsPDF: {
							unit: 'px',
							orientation: '${orientation}',
							format: [${finalDimensions[0]}, ${finalDimensions[1]}],
							hotfixes: ['px_scaling']
						}
					};
					
					html2pdf()
						.set(opt)
						.from(element)
						.toPdf()
						.get('pdf')
						.then(function(pdf) {
							console.log('PDF generated successfully');
							button.innerText = '✅ Success';
							button.className = 'done';
							setTimeout(function() { 
								button.innerText = '📄 Download PDF';
								button.className = '';
								button.disabled = false;
							}, 2000);
						})
						.save()
						.catch(function(error) {
							console.error('PDF generation failed:', error);
							button.innerText = '❌ Error';
							button.className = '';
							setTimeout(function() { 
								button.innerText = '📄 Download PDF';
								button.disabled = false;
							}, 3000);
						});
				});
			});
			</script>
		</body>
		</html>
		`;

		// Create data URL with proper encoding
		const encodedHtml = encodeURIComponent(originalHTML);
		const dataUrl = "data:text/html;charset=utf-8," + encodedHtml;
		
		// Check if data URL is too large (most browsers limit to ~2MB)
		if (dataUrl.length > 2000000) {
			console.warn('Generated HTML is very large, may cause issues');
		}
		
		return dataUrl;
		
	} catch (error) {
		console.error('Allusio API Error:', error);
		
		// Return a simple error page
		const errorHTML = `
		<!DOCTYPE html>
		<html>
		<head>
			<title>PDF Generation Error</title>
			<style>
				body { font-family: Arial, sans-serif; padding: 20px; }
				.error { color: red; background: #ffe6e6; padding: 15px; border-radius: 5px; }
			</style>
		</head>
		<body>
			<div class="error">
				<h2>PDF Generation Error</h2>
				<p>Error: ${error.message}</p>
				<p>Please check your inputs and try again.</p>
			</div>
		</body>
		</html>
		`;
		
		return "data:text/html;charset=utf-8," + encodeURIComponent(errorHTML);
	}
};
