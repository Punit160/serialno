import React from "react";
import ReactApexChart from "react-apexcharts";

class ActivityApexBarGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: 'Energy Generated',
          data: [120, 150, 135, 170],
        },
        {
          name: 'Energy Dispatched',
          data: [100, 130, 110, 150],
        },
      ],
      options: {
        chart: {
        //   height: 200,
          type: "bar",
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            borderRadius: 6,
            horizontal: false,
            columnWidth: '57%',
          },
        },
        colors: ['#4CAF50', '#FF9800'],
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 4,
          colors: ['transparent'],
        },
        grid: {
          borderColor: '#eee',
        },
        xaxis: {
          categories: ['Mon', 'Tue', 'Wed', 'Thu'],
          labels: {
            style: {
              colors: '#3e4954',
              fontSize: '13px',
              fontFamily: 'poppins',
              fontWeight: 400,
            },
          },
        },
        yaxis: {
          labels: {
            formatter: (val) => `${val} kWh`,
            style: {
              colors: '#3e4954',
              fontSize: '13px',
              fontFamily: 'poppins',
              fontWeight: 400,
            },
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " kWh";
            },
          },
        },
        responsive: [
          {
            breakpoint: 1600,
            options: {
              chart: { height: 400 },
            },
          },
          {
            breakpoint: 575,
            options: {
              chart: { height: 250 },
            },
          },
        ],
      },
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height={400}
      />
    );
  }
}

export default ActivityApexBarGraph;
