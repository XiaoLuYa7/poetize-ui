<template>
  <div>
    <transition name="body">
      <div v-show="showEmoji" class="emoji-body">
        <span
          class="emoji-item"
          v-for="(value, key, index) in emojiListURL"
          :key="index"
          @click="addEmoji(key)"
        >
          <img
            loading="lazy"
            class="emoji"
            :src="value"
            :title="key"
            width="30"
            height="30"
          />
        </span>
      </div>
    </transition>
  </div>
</template>

<script>
import { $on, $off, $once, $emit } from '../../../utils/gogocodeTransfer'
export default {
  props: {
    showEmoji: {
      type: Boolean,
    },
  },
  data() {
    return {
      emojiList: this.$constant.emojiList,
      emojiListURL: {},
    }
  },
  created() {
    this.emojiListURL = this.getEmojiList(this.emojiList)
  },
  methods: {
    addEmoji(key) {
      $emit(this, 'addEmoji', key)
    },
    getEmojiList(emojiList) {
      let emojiName
      let url
      let result = {}
      for (let i = 0; i < emojiList.length; i++) {
        emojiName = '[' + emojiList[i] + ']'
        let j = i + 1
        url = import.meta.env.VITE_WEB_STATIC_RESOURCE_PREFIX
        ;+'emoji/q' + j + '.gif'
        result[emojiName] = url
      }
      return result
    },
  },
  emits: ['addEmoji'],
}
</script>

<style scoped>
.emoji-body {
  max-width: 400px;
}
.emoji-item {
  cursor: pointer;
  display: inline-block;
}
.emoji-item:hover {
  transition: all 0.2s;
  border-radius: 0.25rem;
  background: var(--lightGray);
}
.emoji {
  margin: 0.25rem;
  vertical-align: middle;
}
.body-enter-active,
.body-leave-active {
  transition: all 0.3s;
}
.body-enter-from,
.body-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
