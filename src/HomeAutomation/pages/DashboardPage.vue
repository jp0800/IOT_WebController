<template>
  <div class="dp-parent">
    <!-- nav -->
    <RoutedNavigation></RoutedNavigation>
    <!-- header -->
    <div class="dp-header">
      <h1>Room List</h1>
    </div>
    <div class="dp-room-list">
      <RoomController title="Room 1" id="ESP_1" :is-available="true"></RoomController>
      <RoomController title="Room 2" id="ESP_2" :is-available="false"></RoomController>
      <RoomController title="Room 3" id="ESP_3" :is-available="false"></RoomController>
      <RoomController title="Room 4" id="ESP_4" :is-available="false"></RoomController>
    </div>
  </div>
</template>
<script setup>
import RoutedNavigation from '../navigation/RoutedNavigation.vue'
import RoomController from './RoomController.vue'
</script>
<style scoped>
.dp-room-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: center;

  gap: 1rem;
  padding: 1rem;
}

.dp-header h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 200;
}
.dp-room-list a {
  width: 15rem;
  height: 20rem;

  display: flex;
  flex-direction: column;

  justify-content: space-around;
  align-items: center;
  text-align: center;

  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.5);
  border-radius: 0.8rem;

  color: black;
  text-decoration: none;

  padding: 1rem;
  transition: 0.2s ease;
}

.dp-room-list a:hover {
  background-color: #003185;
  color: white;
}
.dp-room-list h1 {
  font-size: 1.5rem;
}

.dp-room-active {
  display: flex;
  flex-direction: row;

  gap: 1rem;
  font-size: 2rem;
}
</style>
