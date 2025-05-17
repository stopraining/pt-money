import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export const useAlerts = () => {
  // default
  const swal = Swal.mixin({
    confirmButtonText: "確定",
    confirmButtonColor: "#74512d",
    cancelButtonText: "取消",
    cancelButtonColor: "gray",
  });
  const errorSwal = (title, text, icon, html, button, timer, width) => {
    /**
     * Sweet Alert 彈出訊息
     * 目前取消按健預設為不顯示
     * @param title 標題
     * @param text 內容
     * @param icon warning, error, success, info, question
     * @param html HTML內容
     * @param button 是否顯示Button(確認健)
     * @param timer 顯示時間(時間到消失，單位為毫秒)
     * @param width 視窗寬度
     */
    const swalSetting = {
      title,
      text,
      html,
      icon, // (warning, error, success, info, question)
      showConfirmButton: button,
      showCancelButton: false,
      heightAuto: false,
    };
    if (timer !== -1) {
      swalSetting.timer = timer;
    }
    if (width !== "" || width !== null) {
      swalSetting.width = width;
    }
    // if (!isEmpty(width)) {
    //   swalSetting.width = width;
    // }
    swal.fire(swalSetting);
  };

  /**
   * Sweet Alert 彈出訊息
   * @param title
   * @param icon
   */
  const simpleSwal = (title, icon) => {
    if (icon === "success") {
      errorSwal(title, "", icon, "", false, 1000);
    } else if (icon === "warning") {
      errorSwal(title, "", icon, "", false, 2000);
    } else {
      errorSwal(title, "", icon, "", true, -1);
    }
  };
  return { simpleSwal };
};
