import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as HC from 'highcharts';
const Highcharts: any = HC;

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/observable/of';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sparkLine') sparkLineTarget: ElementRef;

  title = 'app';
  sparkLineChart: Highcharts.ChartObject;

  testData = {
    name: 'Test',
    data: [1, 0, 4, 10, 100, 25, 100, 302, 10, 1, 0, 4, 10, 100, 25, 100, 302, 10]
  };

  ngAfterViewInit() {
    this.sparkLineChart = this.renderSparkLine();

    this.addChartData()
      .subscribe(() => {
        console.log('Added DataPoint');
        this.sparkLineChart.redraw();
      });
  }

  ngOnDestroy() {
    this.sparkLineChart = null;
  }

  renderSparkLine() {
    return Highcharts.chart(this.sparkLineTarget.nativeElement, {
        chart: {
          backgroundColor: null,
          borderWidth: 0,
          type: 'spline',
          margin: [2, 0, 2, 0],
          width: 120,
          height: 20,
          style: {
            overflow: 'visible'
          },

          // small optimalization, saves 1-2 ms each sparkline
          skipClone: true
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        xAxis: {
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            startOnTick: false,
            endOnTick: false,
            tickPositions: []
        },
        yAxis: {
            endOnTick: false,
            startOnTick: false,
            labels: {
                enabled: false
            },
            title: {
                text: null
            },
            tickPositions: [0]
        },
        legend: {
            enabled: false
        },
        tooltip: {
            backgroundColor: null,
            borderWidth: 0,
            shadow: false,
            useHTML: true,
            hideDelay: 0,
            shared: true,
            padding: 0,
            positioner: function (w, h, point) {
                return { x: point.plotX - w / 2, y: point.plotY - h };
            }
        },
        plotOptions: {
            series: {
                animation: false,
                lineWidth: 1,
                shadow: false,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    radius: 1,
                    states: {
                        hover: {
                            radius: 2
                        }
                    }
                },
                fillOpacity: 0.25
            },
            column: {
                negativeColor: '#910000',
                borderColor: 'silver'
            }
      },
      series: [
        {
          name: 'Test',
          data: []
        },
      ]
    });
  }

  addChartData() {
    return Observable.of(...this.testData.data)
    .map(d => Observable.of(d).delay(2000))
    .concatAll()
    .map(d => {
      this.sparkLineChart.series[0].addPoint(d, false, false, {
        duration: 100,
      });
    });
  }
}
