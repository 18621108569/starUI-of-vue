<template>
  <button
    :disabled="disabled"
    :style="styles"
    ref="btn"
    :class="classes"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @mouseenter.stop="handleMouseenter"
    @mouseleave.stop="handleMouseleave"
    @mouseup="handleMouseup($event)"
    @mousedown="handleMousedown($event)"
  >
    <div class="btn-active" ref="btnActive" :style="location"></div>
    <div class="btn-pie-right" />
    <div class="btn-pie-left" />
    <Icon v-if="icon" :type="icon" />
    <slot name="iconNode"></slot>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>
<script>
import { oneOf, colorRgb } from "../../utils/assist";
import Icon from "../icon";
const prefixCls = "sta-btn";
let timeOut = "";
export default {
  name: "sButton",
  components: { Icon },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: String,
    loading: {
      type: [Boolean, Object],
      default: false,
    },
    loadType: {
      type: String,
      default: "circle",
      validator(value) {
        return oneOf(value, ["circle", "progress"]);
      },
    },
    shape: {
      type: String,
      validator(value) {
        return oneOf(value, ["circle-outline", "circle"]);
      },
    },
    type: {
      type: String,
      validator(value) {
        return oneOf(value, [
          "default",
          "primary",
          "dashed",
          "danger",
          "info",
          "success",
          "warning",
          "error",
        ]);
      },
      default: "default",
    },
    backgroundColor: {
      type: String,
    },
    fontColor: {
      type: String,
    },
  },
  data() {
    return {
      autoWidth: "",
      clicked: false,
      top: this.loading ? "50%" : 0,
      left: this.loading ? "50%" : 0,
      width: "auto",
      currentColor: this.backgroundColor,
      isFocus: false,
    };
  },
  mounted() {
    if (this.shape === undefined) {
      if (this.loading) {
        this.width = "30px";
      } else {
        timeOut = setTimeout(() => {
          if (this.$refs["btn"]) {
            this.autoWidth = this.$refs["btn"].offsetWidth + "px";
            this.width = this.autoWidth;
          }
          clearTimeout(timeOut);
          timeOut = "";
        }, 1000);
      }
    } else if (this.shape === "circle") {
      this.width = "32px";
    }
  },
  beforeDestroy() {
    clearTimeout(timeOut);
    timeOut = "";
  },
  computed: {
    classes() {
      return [
        prefixCls,
        {
          [`${prefixCls}-${this.type}`]: this.type,
          [`${prefixCls}-${this.shape}`]: this.shape,
          [`${prefixCls}-icon-only`]: !this.$slots.default && this.icon,
          [`${prefixCls}-loading-${this.loadType}`]: this.loading,
          [`${prefixCls}-clicked`]: this.clicked,
        },
      ];
    },
    location() {
      let { left, top } = this;
      if (typeof left === "number" && typeof top === "number") {
        return {
          left: left + "px",
          top: top + "px",
        };
      } else if (typeof left === "string" && typeof top === "string") {
        return {
          left,
          top,
        };
      }
    },
    styles() {
      return {
        width: this.width,
        backgroundColor: this.currentColor || undefined,
        border: this.currentColor ? "none" : undefined,
        color: this.fontColor || undefined,
      };
    },
  },
  watch: {
    loading(val) {
      if (this.shape === undefined) {
        if (val) {
          this.left = this.top = "50%";
          this.width = "30px";
        } else {
          this.width = this.autoWidth;
        }
      }
    },
  },
  methods: {
    handleMousedown(e) {
      e.button == 0 && !this.loading && (this.clicked = false);
    },
    handleMouseup(e) {
      if (e.button == 0 && !this.loading) {
        this.clicked = true;
        this.left =
          e.clientX -
          this.$refs["btnActive"].getBoundingClientRect().left +
          this.left;
        this.top =
          e.clientY -
          this.$refs["btnActive"].getBoundingClientRect().top +
          this.top;
      }
    },
    handleClick(event) {
      this.$emit("click", event);
    },
    handleFocus() {
      if (this.backgroundColor) {
        this.currentColor = colorRgb(this.backgroundColor, 0.8);
        this.isFocus = true;
      }
    },
    handleBlur() {
      if (this.backgroundColor) {
        this.currentColor = this.backgroundColor;
        this.isFocus = false;
      }
    },
    handleMouseenter() {
      this.backgroundColor &&
        (this.currentColor = colorRgb(this.backgroundColor, 0.8));
    },
    handleMouseleave() {
      this.backgroundColor &&
        !this.isFocus &&
        (this.currentColor = this.backgroundColor);
    },
  },
};
</script>