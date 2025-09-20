<template>
  <div
    v-permission="['annulReportManage']"
    :id="id"
    ref="courseCategoryRef"
    :class="className"
    style="height: 100%; width: 100%"
  />
</template>

<script>
export default {
  name: "CourseCategory",
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
    courseCategory: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      courseData: [],
      total: 0,
    };
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
    getOpts() {
      const keys = Object.keys(this.courseCategory);
      const values = Object.values(this.courseCategory);
      const maxValue = Math.max(...values);
      const indicator = keys.map((it) => {
        return {
          name: it,
          max: maxValue,
        };
      });
      return {
        title: {
          text: "",
        },
        tooltip: {
          show: true,
          trigger: "item",
          confine: true,
        },
        radar: {
          center: ["50%", "65%"],
          radius: "95%",
          name: {
            textStyle: {
              color: "#3D4D65",
            },
            fontSize: 18,
          },
          axisLine: {
            lineStyle: {
              color: "#DEDEDE",
              width: 1,
              type: "dotted",
            },
          },
          splitLine: {
            lineStyle: {
              color: ["#DEDEDE"],
              width: 1,
            },
          },
          splitArea: {
            areaStyle: {
              color: [
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0)",
                "rgba(255, 255, 255, 0)",
              ],
              shadowColor: "#fff",
            },
          },
          indicator,
        },
        series: [
          {
            type: "radar",
            data: [
              {
                value: values,
                name: "课程分类数据",
                labelLine: {
                  show: true,
                  lineStyle: {
                    color: "#3c4858",
                  },
                },
                lineStyle: {
                  normal: {
                    width: 2,
                  },
                },
                itemStyle: {
                  normal: {
                    borderWidth: 3,
                    color: "#26A0FF",
                  },
                },
                areaStyle: {
                  normal: {
                    color: "rgba(64,159,223,0.4)",
                  },
                },
              },
            ],
          },
        ],
      };
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.courseCategoryRef);
      this.chart.setOption(this.getOpts());
    },
  },
};
</script>

<style scoped></style>
