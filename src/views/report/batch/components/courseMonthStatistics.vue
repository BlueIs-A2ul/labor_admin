<template>
  <div
    v-permission="['annulReportManage']"
    :id="id"
    ref="courseMonthStatisticsRef"
    :class="className"
    style="height: 100%; width: 100%"
  />
</template>
<script>
export default {
  name: "CourseMonthStatistics",
  props: {
    useResize: {
      type: Boolean,
      default: false,
      required: true,
    },
    className: {
      type: String,
      default: "base-echart",
    },
    id: {
      type: String,
      default: "base-echart",
    },
    width: {
      type: String,
      default: "600px",
    },
    height: {
      type: String,
      default: "250px",
    },
    monthlyStatistics: {
      type: Array,
      required: true,
    },
  },
  watch: {
    courseCategory: {
      handler(newval, oldval) {
        if (newval) {
          if (this.chart) {
            this.chart.setOption(this.getOpts());
          } else {
            this.initChart();
          }
        }
        return newval;
      },
      deep: true,
    },
    useResize: {
      handler(newVal) {
        if (newVal && this.chart) {
          this.chart.resize();
        }
      },
    },
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.clear();
      this.chart.dispose();
      this.chart = null;
    }
  },
  created() {},
  mounted() {
    this.initChart();
  },
  methods: {
    createOpts() {
      const testData = this.monthlyStatistics;
      const names = testData.map((it) => it.date);
      const coursesCount = testData.map((it) => it.coursesCount);
      const coursesMax = Math.max.apply((it) => it.coursesCount, coursesCount);
      const studentsRate = testData.map(
        (it) => (it.attendance * 100.0) / it.pass
      );
      const option = {
        title: {
          text: "",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        legend: {
          data: ["课程数量", "参与率"],
        },
        xAxis: [
          {
            type: "category",
            data: names,
            axisPointer: {
              type: "shadow",
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "课程数量",
            min: 0,
            max: coursesMax,
            interval: 5,
            axisLabel: {
              formatter: "{value} 门",
            },
          },
          {
            type: "value",
            name: "参与率",
            min: 0,
            max: 100,
            interval: 20,
            axisLabel: {
              formatter: "{value} %",
            },
          },
        ],
        series: [
          {
            name: "课程数量",
            type: "bar",
            color: "#7393d3",
            tooltip: {
              valueFormatter: function (value) {
                return value + "门";
              },
            },
            data: coursesCount,
          },
          {
            name: "参与率",
            type: "line",
            color: "#fac87e",
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + " %";
              },
            },
            data: studentsRate,
          },
        ],
      };
      return option;
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.courseMonthStatisticsRef);
      this.chart.setOption(this.createOpts());
    },
  },
};
</script>

<style scoped></style>
