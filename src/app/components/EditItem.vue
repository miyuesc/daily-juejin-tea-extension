<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  align: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  textAlign: {
    type: String,
    default: 'right',
    validator: (val: string) => ['left', 'center', 'right'].includes(val),
  },
  labelWidth: {
    type: Number,
    default: 80,
  },
})

const computedStyles = computed(() => {
  return {
    '--label-width': `${props.labelWidth}px`,
    '--text-align': props.textAlign as 'center',
    '--el-align': props.align === 'vertical' ? 'column' : 'row',
  }
})
</script>

<template>
  <div class="edit-item" :style="computedStyles">
    <div class="edit-item_label">
      {{ label }}：
    </div>
    <div class="edit-item_content">
      <slot />
      <div v-if="!!description" class="edit-item_description">
        <span>{{ description }}</span>
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  line-height: 28px;
  flex-direction: var(--el-align);
  .edit-item_label {
    width: var(--label-width);
    text-align: var(--text-align);
  }
  .edit-item_content {
    flex: 1;
  }
  .edit-item_description {
    font-size: 12px;
    color: #767c82;
    line-height: 16px;
    padding-top: 8px;
  }

  & + .edit-item {
    margin-top: 12px;
  }
}
</style>
