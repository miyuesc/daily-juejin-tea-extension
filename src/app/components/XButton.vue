<script setup lang="ts">
import { computed, PropType } from "vue";

type ButtonType = "primary" | "default" | "warning" | "error" | "info";
type ButtonSize = "mini" | "small" | "medium" | "big";

const props = defineProps({
  type: {
    type: String as PropType<ButtonType>,
    default: "primary",
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: "medium",
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const emits = defineEmits(["click"]);

const classes = computed(() => {
  let classes: string = "x-button";
  classes += ` x-button-${props.type}`;
  classes += ` x-button-${props.size}`;
  props.disabled && (classes += ` x-button-disabled`);

  return classes;
});

const buttonClick = () => {
  if (props.disabled) {
    return;
  }
  emits("click");
};
</script>

<template>
  <div :class="classes" @click="buttonClick">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.x-button {
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid;
  display: inline-block;
  &.x-button-disabled {
    cursor: not-allowed;
  }
  &-default {
    color: var(--juejin-font-1);
    background-color: var(--juejin-layer-1);
    border-color: var(--juejin-font-4);
    &:hover,
    &:active {
      background-color: var(--juejin-layer-3-fill);
    }
    &.x-button-disabled {
      background-color: var(--juejin-layer-1);
    }
  }
  &-primary {
    color: var(--juejin-font-white);
    background-color: var(--juejin-brand-1-normal);
    border-color: var(--juejin-brand-1-normal);
    &:hover,
    &:active {
      background-color: var(--juejin-brand-2-hover);
    }
    &.x-button-disabled {
      background-color: var(--juejin-brand-4-disable);
    }
  }
  &-warning {
    color: var(--juejin-font-white);
    background-color: var(--juejin-warning-1-normal);
    border-color: var(--juejin-warning-1-normal);
    &:hover,
    &:active {
      background-color: var(--juejin-warning-2-deep);
    }
    &.x-button-disabled {
      background-color: var(--juejin-warning-3-light);
    }
  }
  &-error {
    color: var(--juejin-font-white);
    background-color: var(--juejin-danger-1-normal);
    border-color: var(--juejin-danger-1-normal);
    &:hover,
    &:active {
      background-color: var(--juejin-danger-2-deep);
    }
    &.x-button-disabled {
      background-color: var(--juejin-danger-3-light);
    }
  }

  &-mini {
    font-size: 12px;
    padding: 3px 6px;
    border-radius: 2px;
  }
  &-small {
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 2px;
  }
  &-medium {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 4px;
  }
  &-big {
    font-size: 16px;
    padding: 8px 16px;
    border-radius: 4px;
  }
}
</style>
