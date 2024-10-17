import { useEffect } from "react";

/**
 * Custom hook that triggers a callback when clicking outside specified elements.
 *
 * @param {Array<React.RefObject>} refs - An array of React ref objects to check against.
 *                                         The callback is called if a click occurs outside
 *                                         all referenced elements.
 * @param {Function} callback - The function to be called when a click outside is detected.
 *
 * @example
 * useClickOutside([menuRef, buttonRef], () => setIsMenuOpen(false));
 */
function useClickOutside(refs, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside any of the referenced elements
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target)
      );

      if (isOutside) {
        callback();
      }
    };

    // Add event listener to detect outside clicks
    document.addEventListener("click", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [refs, callback]);
}

export default useClickOutside;
