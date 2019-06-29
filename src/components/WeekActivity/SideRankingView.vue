<template>
  <q-card style="width: 500px">
    <q-card-section>
      <h5 class="q-mt-none q-mb-none">TEK-PS Ranking</h5>
      <p
        class="text-body-2 text-grey-5"
      >Your Personal progress tracking through the TEK-PSC courses, training and contests</p>
    </q-card-section>
    <q-card-section class="row items-center no-wrap">
      <apexchart width="450" type="bar" :options="options" :series="series"></apexchart>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  data() {
    return {
      options: {
        chart: {
          id: "ranking",
          toolbar: {
            show: false
          }
        },
        yaxis: {
          title: {
            text: "Contests Ranking"
          }
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
  }
};
</script>

<style>
</style>
