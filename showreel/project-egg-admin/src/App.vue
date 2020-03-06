<template>
  <div id="app">
    <div class="page-header">
      <h1>Project Egg Admin <span>Tool</span></h1>
    </div>
    <div class="page-wrapper">
      <h2>Filter eggs by:</h2>
      <p>Author's name</p>
      <input v-model="author" placeholder="Author name">
      <input
      :id="isFlagged"
      name="isFlagged"
      v-model="isFlagged"
      type="checkbox"
      @change="getEggs()"
      >
      <label for="isFlagged">Show flagged eggs</label>
      <input
      :id="isApproved"
      name="isApproved"
      v-model="isApproved"
      type="checkbox"

      @change="getEggs()"
      >
      <label for="isApproved">Show approved eggs</label>
      <div class="egg-container">
        <EggItem
        v-for="(egg_item, index) in this.getEggs()"
        :egg="egg_item"
        :key="index"
        v-on:egg-rejected="removeEgg"
        v-on:egg-approved="approveEgg"
        v-on:egg-flagged="flagEgg"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EggItem from './EggItem'
import axios from 'axios'

export default {
  components: {
    EggItem
  },
  name: 'app',
  data: function() {
    return {
      eggsData: [],
      filterOptions: [],
      isFlagged: false,
      isApproved: false,
      activeFilters: [],
      author: ''
    }
  },
  created() {
    this.filterOptions = ['flagged', 'approved'];
  },
  mounted() {
    let eggsData;

    axios.get('https://project-egg.azurewebsites.net/api/eggs')
      .then((response) => {
        this.eggsData = response.data.eggs;
      })
      .catch(error => console.log('error', error))
  },
  methods: {
    getEggs: function () {
      let filteredEggs = [...this.eggsData];
        if (this.isApproved) {
          filteredEggs = filteredEggs.filter(egg => egg.isApproved);
        }
        if (this.isFlagged) {
          filteredEggs = filteredEggs.filter(egg => egg.isFlagged);
        }
        if (this.author) {
          filteredEggs = filteredEggs.filter(egg => this.findString(egg.author, this.author));
        }
      return filteredEggs;
    },
    findString: function(myString, mySubstring) {
      if (typeof myString === 'string' && typeof mySubstring === 'string') {
        return myString.toLowerCase().includes(mySubstring.toLowerCase());
      }
    },
    removeEgg: function(id) {
      const index = this.eggsData.findIndex(element => element.id === id);
      axios.delete('https://project-egg.azurewebsites.net/api/egg/' + id);
      return this.eggsData.splice(index, 1);
    },
    approveEgg: function(id) {
      const index = this.eggsData.findIndex(element => element.id === id);
      if (!this.eggsData[index].isApproved) {
        axios.put('https://project-egg.azurewebsites.net/api/egg/' + id, {
          isApproved: true
        });
        this.eggsData[index].isApproved = true;
      } else {
        axios.put('https://project-egg.azurewebsites.net/api/egg/' + id, {
          isApproved: false
        });
        this.eggsData[index].isApproved = false;
      }
    },
    flagEgg: function(id) {
      const index = this.eggsData.findIndex(element => element.id === id);
      if (!this.eggsData[index].isFlagged) {
        axios.put('https://project-egg.azurewebsites.net/api/egg/' + id, {
          isFlagged: true
        });
        this.eggsData[index].isFlagged = true;
      } else {
        axios.put('https://project-egg.azurewebsites.net/api/egg/' + id, {
          isFlagged: false
        });
        this.eggsData[index].isFlagged = false;
      }
    }
  }
}
</script>

