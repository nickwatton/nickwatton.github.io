<template>
  <div class="egg-item">
    <p><img :src="egg.textureImageUrl" /></p>
    <p><img :src="egg.previewImageUrl" /></p>
    <p><img class="egg-item-thumb" :src="egg.textureThumbUrl" /><img class="egg-item-thumb" :src="egg.previewThumbUrl" /></p>
    <div class="egg-detail">
      <h3>Title: <span>{{egg.title}}</span></h3>
      <p><strong>Description: </strong>{{egg.description}}</p>
      <p><strong>Author:</strong> {{egg.author}}</p>
      <p><strong>Flagged:</strong> {{egg.isFlagged}}</p>
      <p><strong>Approved:</strong> {{egg.isApproved}}</p>
    </div>
    <div class="egg-detail">
      <button @click="$emit('egg-approved', egg.id)">{{this.approvedState}}</button>
      <button @click="$emit('egg-flagged', egg.id)">{{this.flaggedState}}</button>
      <button @click="$emit('egg-rejected', egg.id)">Reject</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['egg'],
  computed: {
    approvedState: function() {
      let approveValue;
      if (this.egg.isApproved === true) {
        approveValue = 'Unapprove';
      } else {
        approveValue = 'Approve';
      }
      return approveValue;
    },
    flaggedState: function() {
      let flagValue;
      if (this.egg.isFlagged === true) {
        flagValue = 'Unflag';
      } else {
        flagValue = 'Flag';
      }
      return flagValue;
    }
  }
}
</script>
