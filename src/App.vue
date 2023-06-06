<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Widget from "@/components/Widget.vue";
import { useTestStore } from "@/store";
import { ref, onMounted } from "vue";
// import Chart from "chart.js";

interface Style {
  top: string;
  left: string;
  width: string;
  height: string;
}

const testStore = useTestStore();

const uniqueViewStyle = ref(
  window.localStorage.getItem("uniqueViewStyle")
    ? (JSON.parse(
        window.localStorage.getItem("uniqueViewStyle") as string
      ) as Style)
    : {
        top: "100px",
        left: "250px",
        width: "200px",
        height: "200px",
      }
);
const uniqueViewTotal = ref(0);
const uniqueViewDiffYesterDay = ref(0);

const totalViewStyle = ref(
  window.localStorage.getItem("totalViewStyle")
    ? (JSON.parse(
        window.localStorage.getItem("totalViewStyle") as string
      ) as Style)
    : {
        top: "100px",
        left: "550px",
        width: "200px",
        height: "200px",
      }
);
const totalViewTotal = ref(0);
const totalViewDiffYesterDay = ref(0);

const chartViewStyle = ref(
  window.localStorage.getItem("chartViewStyle")
    ? (JSON.parse(
        window.localStorage.getItem("chartViewStyle") as string
      ) as Style)
    : {
        top: "200px",
        left: "250px",
        width: "200px",
        height: "200px",
      }
);
const chartDate = ref([]);
const chartUnique = ref([]);
const chartPage = ref([]);

const referralViewStyle = ref(
  window.localStorage.getItem("referralViewStyle")
    ? (JSON.parse(
        window.localStorage.getItem("referralViewStyle") as string
      ) as Style)
    : {
        top: "500px",
        left: "250px",
        width: "200px",
        height: "200px",
      }
);

const referralData = ref([]);
const referralChart = ref(null);

const getData = async () => {
  await testStore.getTotalUserData();
  uniqueViewTotal.value = testStore.$state.totalUserData.reduce(
    (a: string, c: StringConstructor) => parseInt(a) + parseInt(c[1]),
    0
  );
  uniqueViewDiffYesterDay.value =
    parseInt(testStore.$state.totalUserData[0][1]) -
    parseInt(testStore.$state.totalUserData[1][1]);

  totalViewTotal.value = testStore.$state.totalUserData.reduce(
    (a: string, c: StringConstructor) => parseInt(a) + parseInt(c[2]),
    0
  );
  totalViewDiffYesterDay.value =
    parseInt(testStore.$state.totalUserData[0][2]) -
    parseInt(testStore.$state.totalUserData[1][2]);
  chartDate.value = testStore.$state.totalUserData.map((v) => v[0]).reverse();
  chartUnique.value = testStore.$state.totalUserData.map((v) => v[1]).reverse();
  chartPage.value = testStore.$state.totalUserData.map((v) => v[2]).reverse();

  await testStore.getTopReferralData();
  referralData.value = testStore.$state.referralData;
};

const makeChart = async () => {
  const { Chart, registerables } = await import("chart.js");
  Chart.register(...registerables);
  const ctx = document.getElementById("chartCanvas");
  const ctx2 = document.getElementById("chartCanvasRange");
  const ctx3 = document.getElementById("pieChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: chartDate.value,
      datasets: [
        {
          label: "Unique Event Count",
          yAxisID: "y-left",
          data: chartPage.value,
          borderWidth: 1,
        },
        {
          label: "Total Event Count",
          yAxisID: "y-right",
          type: "line",
          data: chartUnique.value,
          fill: false,
          lineTension: 0.2, // 0이면 꺾은선 그래프, 숫자가 높을수록 둥글해짐
          pointRadius: 0, // 각 지점에 포인트 주지 않음
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        "y-left": {
          type: "linear",
          position: "left",
          title: {
            display: true,
          },
          grid: {
            display: false,
          },
        },
        "y-right": {
          type: "linear",
          position: "right",
          title: {
            display: true,
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });

  new Chart(ctx2, {
    type: "line",
    data: {
      labels: chartDate.value,
      datasets: [
        {
          label: "",
          type: "line",
          data: chartUnique.value,
          fill: true,
          lineTension: 0.2, // 0이면 꺾은선 그래프, 숫자가 높을수록 둥글해짐
          pointRadius: 0, // 각 지점에 포인트 주지 않음
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false, // 레전드 숨김
        },
      },
      scales: {
        x: {
          display: false, // x축 라벨 숨김
          grid: {
            display: true,
          },
        },
        y: {
          display: false, // y축 라벨 숨김
          grid: {
            display: true,
          },
        },
      },
    },
  });

  referralChart.value = new Chart(ctx3, {
    type: "pie",
    data: {
      labels: referralData.value.map((v: string[]) => v[0]),
      datasets: [
        {
          label: "",
          type: "pie",
          data: referralData.value.map((v: string[]) => v[1]),
          backgroundColor: [
            "#d63031",
            "#ff7675",
            "#ffeaa7",
            "#0984e3",
            "#55efc4",
          ],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: true,
          position: "left",
        },
      },
    },
  });
};

const filterTitle = (title: string) => {
  switch (title) {
    case "unique_view":
      return "접속 유저";
    case "page_view":
      return "접속 횟수";
  }
};

onMounted(() => {
  getData();
  makeChart();
});
</script>

<template>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <div class="main">
    <Widget
      :title="filterTitle(testStore.$state.totalUserSumHeader.key)"
      :top="uniqueViewStyle.top"
      :left="uniqueViewStyle.left"
      :width="uniqueViewStyle.width"
      :height="uniqueViewStyle.height"
      isDescrption
      type="SUM"
      :label="testStore.$state.totalUserSumHeader.label"
      id="uniqueViewStyle"
    >
      <div class="value">{{ uniqueViewTotal.toLocaleString() }}</div>
      <div :class="uniqueViewDiffYesterDay < 0 ? 'minus' : 'plus'">
        <i v-if="uniqueViewDiffYesterDay < 0" class="fas fa-arrow-down"></i>
        <i v-else class="fas fa-arrow-up"></i>
        {{ uniqueViewDiffYesterDay }}
      </div>
    </Widget>
    <Widget
      :title="filterTitle(testStore.$state.totalUserHeader.key)"
      :top="totalViewStyle.top"
      :left="totalViewStyle.left"
      :width="totalViewStyle.width"
      :height="totalViewStyle.height"
      isDescrption
      type="SUM"
      :label="testStore.$state.totalUserHeader.label"
      id="totalViewStyle"
    >
      <div class="value">{{ totalViewTotal.toLocaleString() }}</div>
      <div :class="uniqueViewDiffYesterDay < 0 ? 'minus' : 'plus'">
        <i v-if="totalViewDiffYesterDay < 0" class="fas fa-arrow-down"></i>
        <i v-else class="fas fa-arrow-up"></i>
        {{ totalViewDiffYesterDay.toLocaleString() }}
      </div>
    </Widget>
    <Widget
      title="DAU"
      :top="chartViewStyle.top"
      :left="chartViewStyle.left"
      :width="chartViewStyle.width"
      :height="chartViewStyle.height"
      id="chartViewStyle"
    >
      <canvas
        id="chartCanvasRange"
        width="500"
        height="30"
        class="range"
      ></canvas>
      <canvas id="chartCanvas" width="500" height="200"></canvas>
    </Widget>
    <Widget
      title="Top Refarral"
      :top="referralViewStyle.top"
      :left="referralViewStyle.left"
      :width="referralViewStyle.width"
      :height="referralViewStyle.height"
      id="referralViewStyle"
    >
      <canvas id="pieChart" width="400" height="200"></canvas>
    </Widget>
  </div>
</template>

<style lang="scss">
.main {
  width: 80vw;
  min-height: 100vh;
  text-align: center;
  border-left: 1px solid grey;
  border-right: 1px solid grey;
  background-color: #bdc3c7;
  opacity: 0.8;
  background-image: linear-gradient(#7f8c8d 1px, transparent 1px),
    linear-gradient(to right, #7f8c8d 1px, #e5e5f7 1px);
  background-size: 70px 40px;
}
.value {
  font-size: 24px;
  font-weight: 700;
}

.minus {
  color: #0984e3;
}

.plus {
  color: red;
}
.fas {
  margin-right: 5px;
}
.range {
  border: 1px solid grey;
  border-radius: 4px;
}
</style>
