import { defineStore } from "pinia";
import axios from "axios";

interface Header {
  description: string;
  idx: number;
  key: string;
  label: string;
  property_type: string;
  value_type: string;
}

interface State {
  totalUserHeader: Header;
  totalUserSumHeader: Header;
  totalUserData: string[];
}
export const useTestStore = defineStore("testStore", {
  state: (): State => ({
    totalUserHeader: {
      description: "",
      idx: 0,
      key: "",
      label: "",
      property_type: "",
      value_type: "",
    },
    totalUserSumHeader: {
      description: "",
      idx: 0,
      key: "",
      label: "",
      property_type: "",
      value_type: "",
    },
    totalUserData: [],
    referralData: [],
  }),
  actions: {
    async getTotalUserData() {
      try {
        const res = await axios.get(
          "https://static.adbrix.io/front/coding-test/event_1.json"
        );
        this.$state.totalUserData = res.data.data.rows.sort((a, b) => {
          if (new Date(a[0]) < new Date(b[0])) return 1;
          if (new Date(a[0]) > new Date(b[0])) return -1;
        });
        this.$state.totalUserSumHeader = res.data.data.headers[1];
        this.$state.totalUserHeader = res.data.data.headers[2];
      } catch (err) {
        console.error(err);
      }
    },
    async getTopReferralData() {
      try {
        const res = await axios.get(
          "https://static.adbrix.io/front/coding-test/event_3.json"
        );
        const filteredRows = res.data.data.rows.sort((a, b) => {
          if (new Date(parseInt(a[1])) < new Date(parseInt(b[1]))) return 1;
          if (new Date(parseInt(a[1])) > new Date(parseInt(b[1]))) return -1;
        });
        const otherValue = filteredRows.slice(4);
        const etcValue = otherValue.reduce(function (acc, curr) {
          return acc + parseInt(curr[1]);
        }, 0);
        const result = filteredRows.slice(0, 4);
        result.push(["etc", etcValue.toString()]);
        this.$state.referralData = result;
      } catch (err) {
        console.error(err);
      }
    },
  },
});
