<template>
  <div
    v-permission="['annulReportManage']"
    :id="id"
    ref="courseWordCloudRef"
    :class="className"
    style="height: 100%; width: 100%"
  />
</template>

<script>
const randcolor = () => {
  const r = 100 + ~~(Math.random() * 100);
  const g = 135 + ~~(Math.random() * 100);
  const b = 100 + ~~(Math.random() * 100);
  return `rgb(${r}, ${g}, ${b})`;
};
export default {
  name: "CourseWordCloud",
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
    title: {
      type: String,
      default: "词云",
    },
    words: {
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
      const mockData = this.words;
      const option = {
        title: {
          text: this.title,
        },
        tooltip: {
          trigger: "item",
          padding: [5, 10],
          textStyle: {
            fontSize: 20,
          },
          formatter: (params) => {
            const { name, value } = params;

            return `
                    关键词：${name} <br/>
                    频度：${value}
                `;
          },
        },
        series: [
          {
            type: "wordCloud",
            gridSize: 0,
            sizeRange: [20, 60],
            rotationRange: [-15, 15],
            shape: "circle",
            textStyle: {
              normal: {
                color: (params) => {
                  return randcolor();
                },
              },
              emphasis: {
                shadowBlur: 10,
                shadowColor: "#868585",
              },
            },
            data: mockData,
          },
        ],
      };
      return option;
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.courseWordCloudRef);
      this.chart.setOption(this.createOpts());
    },
  },
};
</script>

<style scoped></style>
