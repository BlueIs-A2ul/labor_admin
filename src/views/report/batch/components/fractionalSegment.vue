<template>
  <div
    v-permission="['annulReportManage']"
    :id="id"
    ref="fractionalSegmentRef"
    :class="className"
    style="height: 100%; width: 100%"
  />
</template>

<script>
export default {
  name: "FractionalSegment",
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
    fractionalSegment: {
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
      const bgColor = "#fff";
      const title = "总量";
      const color = [
        "#c065e7",
        "#765deb",
        "#3862d8",
        "#6a89E2",
        "#219CF9",
        "#6efbbf",
        "#40c057",
        "#ffd351",
        "#ff8e43",
        "#f56b6d",
      ];
      const echartData = this.fractionalSegment;
      const formatNumber = function (num) {
        const reg = /(?=(\B)(\d{3})+$)/g;
        return num.toString().replace(reg, ",");
      };
      const total = echartData.reduce((a, b) => {
        return a + b.value * 1;
      }, 0);
      const option = {
        backgroundColor: bgColor,
        color: color,
        tooltip: {
          trigger: "item",
        },
        title: {
          text: "{name|" + title + "}\n{val|" + formatNumber(total) + "}",
          top: "center",
          left: "center",
          textStyle: {
            rich: {
              name: {
                fontSize: 14,
                fontWeight: "normal",
                color: "#000",
                padding: [10, 0],
              },
              val: {
                fontSize: 18,
                fontWeight: "bolder",
                color: "#000",
              },
            },
          },
        },
        series: [
          {
            type: "pie",
            roseType: "radius",
            radius: ["45%", "80%"],
            center: ["50%", "50%"],
            data: echartData,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                borderColor: bgColor,
                borderWidth: 2,
              },
            },
            labelLine: {
              normal: {
                length: 20,
                length2: 80,
              },
            },
            label: {
              normal: {
                formatter: (params) => {
                  return (
                    "{icon|●}{name|" +
                    params.name +
                    "}\n{value|" +
                    formatNumber(params.value) +
                    "}"
                  );
                },
                rich: {
                  icon: {
                    fontSize: 16,
                    color: "inherit",
                  },
                  name: {
                    fontSize: 18,
                    padding: [0, 0, 0, 10],
                    color: "#000",
                  },
                  value: {
                    fontSize: 14,
                    fontWeight: "bolder",
                    padding: [10, 0, 0, 20],
                    color: "inherit",
                  },
                },
              },
            },
          },
        ],
      };
      return option;
    },
    initChart() {
      this.chart = this.$echarts.init(this.$refs.fractionalSegmentRef);
      this.chart.setOption(this.createOpts());
    },
  },
};
</script>

<style scoped></style>
