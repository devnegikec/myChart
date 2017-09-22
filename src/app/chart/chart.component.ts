import {
  Component,
  OnChanges,
  Input,
  ElementRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'gbar-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GroupBarChartComponent {
	@ViewChild('chart') private chartContainer: ElementRef;
	@Input() private data: any;
	@Input() private oldData: any;
	@Input() private oldKey: any;
	@Input() private config;
	private margin: any = { top: 20, bottom: 60, left: 40, right: 40};
	private tooltip: any;
	private chart: any;
	private width: number;
	private height: number;
	private xScale: any;
	private yScale: any;
	private xAxis: any;
	private yAxis: any;
	private colors: any;
	private xScale1: any;
	private y: any;
	private z: any;
	private colorsTest;

	public ngOnInit() {
		this.createChart();
	}

	public ngOnChanges() {
		if (this.chart && this.data) {
			console.log('on Change');
			this.removeChart();
		  this.createChart();
		}
	}

	public get_y_gridlines(yScale) {
			return d3.axisLeft(yScale)
			.ticks(5);
	}

	public createChart() {
		const element = this.chartContainer.nativeElement;
		this.width = element.offsetWidth - this.margin.left - this.margin.right;
		this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
		const svg = d3.select(element).append('svg')
		  .attr('width', element.offsetWidth)
		  .attr('height', element.offsetHeight);

		const xDomain = this.data.map((d: any) => d.month );
		const yDomain = [0, d3.max(this.data, (d) => {
							return d3.max(this.config.key, (key) => d[key] );
						})];

		this.xScale = d3.scaleBand()
			.padding(0.2)
			.domain(xDomain)
		    .rangeRound([0, this.width])
		    .paddingInner(0.6);

		this.xScale1 = d3.scaleBand()
					.padding(0);

		this.yScale = d3.scaleLinear()
			.domain(yDomain)
			.rangeRound([this.height, 0])
			.nice();

		// bar colors
		this.colors = d3.scaleOrdinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		// x & y axis
		this.xAxis = svg.append('g')
			.attr('class', 'axis axis-x')
			.attr('transform', `translate(${this.margin.left + 20}, ${this.margin.top + this.height})`)
			.call(d3.axisBottom(this.xScale));

		this.yAxis = svg.append('g')
			.attr('class', 'axis axis-y grid')
			.attr('transform', `translate(${this.margin.left + 20 }, ${this.margin.top})`)
			.call(this.get_y_gridlines(this.yScale)
					.tickSize(-this.width));
		// chart plot area
		this.chart = svg.append('g')
			.attr('class', 'bars')
			.attr('transform', `translate(${this.margin.left + 20 },${this.margin.top})`);
		this.xScale1.domain(this.config.key).rangeRound([0, this.xScale.bandwidth()]);

		this.xScale.domain(this.data.map((d: any) => d.month));
		this.yScale.domain([0, d3.max(this.data, (d) => {
						return d3.max(this.config.key, (key) => d[key] );
					})]);
		this.colors.domain([0, this.data.length]);
		const update = this.chart.selectAll('.bars')
			.remove()
			.exit()
			.data(this.data);

		update
			.enter()
			.append('g')
			.attr('class', 'bar-axis')
			.attr('transform', (d) => {
			  return 'translate(' + this.xScale(d.month) + ',0)';
			})
			.selectAll('rect')
			.data( (d) => this.config.key.map((key) => ({key, value: d[key]}) ))
			.enter().append('rect')
			.attr('x', (d) => this.xScale1(d.key) )
			.attr('y', (d) => this.yScale(d.value) )
			.attr('width', this.xScale1.bandwidth(0))
			.attr('height', (d) =>  this.height - this.yScale(d.value))
			.attr('fill', (d) => this.colors(d.key));
	}

	public removeChart() {
		const element = this.chartContainer.nativeElement;
		d3.select(element).selectAll('svg')
		.remove()
		.exit();
	}
}
