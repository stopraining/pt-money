export const useUnits = () => {
  /**
   * 判斷資料是否為空
   * @param data
   * @returns {boolean}
   */
  const isEmpty = (data) => {
    return (
      typeof data !== "number" &&
      typeof data !== "boolean" &&
      (!data || data === "undefined" || Object.keys(data).length === 0)
    );
  };

  return {
    isEmpty,
  };
};
