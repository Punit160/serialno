import React from "react";
import ReactApexChart from "react-apexcharts";

class TransactionApexBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			series: [
				{
					name: 'Panels Generated',
					data: [120, 180, 150, 200, 220, 190],
				},
				{
					name: 'Panels Dispatched',
					data: [90, 140, 130, 170, 180, 160],
				},
			],
			options: {
				chart: {
					type: "bar",
					toolbar: { show: false },
				},
				plotOptions: {
					bar: {
						borderRadius: 10,
						horizontal: false,
						columnWidth: '70%',
					},
				},
				colors: ['#80ec67', '#fe7d65'],
				legend: { show: false },
				fill: {
					opacity: 1,
				},
				dataLabels: {
					enabled: false,
				},
				stroke: {
					show: true,
					width: 5,
					colors: ['transparent'],
				},
				grid: {
					borderColor: '#eee',
				},
				xaxis: {
					categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
					labels: {
						style: {
							colors: '#3e4954',
							fontSize: '13px',
							fontFamily: 'poppins',
						},
					},
				},
				yaxis: {
					labels: {
						offsetX: -16,
						style: {
							colors: '#3e4954',
							fontSize: '13px',
							fontFamily: 'poppins',
						},
					},
					title: {
						text: 'Panels (Units)',
					},
				},
				tooltip: {
					y: {
						formatter: (val) => `${val} Panels`,
					},
				},
				responsive: [
					{
						breakpoint: 575,
						options: {
							chart: {
								height: 250,
							},
						},
					},
				],
			},
		};
	}

	render() {
		return (
			<div id="chart">
				<ReactApexChart
					options={this.state.options}
					series={this.state.series}
					type="bar"
					height={400}
				/>
			</div>
		);
	}
}

export default TransactionApexBar;
