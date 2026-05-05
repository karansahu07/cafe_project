export function formatTime(time) {
  const [hour, minute] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hour));
  date.setMinutes(parseInt(minute));
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

//convert time range to 12 hour format AND GIVE IT IN HH:MM AM/PM FORMAT 
export function convertTimeRange(start, end) {
    return `${formatTime(start)} - ${formatTime(end)}`;
  }


  //format phone number in US and Indian format (+1 (XXX) XXX XXXX or +91 XXXXX YYYYY)
  //  --- IF YOU WANT TO ADD MORE COUNTRY CODE THEN ADD IT IN THE FUNCTION

  export function formatPhone(number, countryCode="+1") {
    // Remove all non-digit characters
    const digits = number?.replace(/\D/g, '');
  
    if (countryCode === '+1') {
      // US Format: +1 (XXX) XXX XXXX
      const match = digits?.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `+1 (${match[1]}) ${match[2]} ${match[3]}`;
      }
    } else if (countryCode === '+91') {
      // Indian Format: +91 XXXXX YYYYY
      const match = digits?.match(/^(\d{5})(\d{5})$/);
      if (match) {
        return `+91 ${match[1]} ${match[2]}`;
      }
    }
  
    // Default: return as-is if format doesn't match
    return `${countryCode} ${number?number:""}`;
  }
  

  //format price in currency format
  export const formatPrice = (value, symbol = '$') => {
    const num = Number(value);
  
    if (isNaN(num)) return "-";
  
    const formatted = num.toLocaleString();
  
    if (symbol === false) {
      return formatted;
    }
  
    return `${symbol}${formatted}`;
  };
  
 export function calculateDiscountPercentage(totalPrice, discountPercentage=0) {
  const discount = (totalPrice * discountPercentage) / 100;
  const finalPrice = totalPrice - discount;
  return parseFloat(finalPrice.toFixed(2)); // number with 2 decimals
  }


//normalize attributes
export function normalizeAttributes(allAttributesJson) {
    try {
      console.log("=============================================================");
      
      console.log("allAttributesJson",allAttributesJson)
      // Step 1: Parse JSON
      // const rawArr = JSON.parse(allAttributesJson);
  
      // Step 2: Normalize keys to { key, value }
      const normalized = allAttributesJson.map(item => ({
        key: item.attribute_key ?? item.key,
        value: item.attribute_value ?? item.value
      }));
      console.log("normalized=========",normalized)
  
      // Step 3: Separate extra attributes
      const extras = ['unit', 'quantity', 'is_available'];
  
      const attributes = normalized.filter(item => !extras.includes(item.key));
      const extraAttributesArray = normalized.filter(item => extras.includes(item.key));
      const extraAttributes = Object.fromEntries(
        extraAttributesArray.map(item => [item.key, item.value])
      );  
      console.log("attributes=========",attributes)
      console.log("extraAttributes========",extraAttributes)
      console.log("=============================================================");

      return {
        attributes,
        extraAttributes
      };
    } catch (error) {
      console.error('Failed to parse attributes:', error);
      return {
        attributes: [],
        extraAttributes: []
      };
    }
  }
  

  export function priceParsed(variants = [], manualPrice) {
    // Step 1: If manualPrice is a valid number, return it
    console.log("manualPrice",manualPrice)
    console.log("variants",variants)
    if (manualPrice !== undefined && !isNaN(Number(manualPrice))) {
      return Number(manualPrice);
    }
   
    // Step 2: If variants exist, find minimum price
    if (variants.length > 0) {
      const prices = variants.map(v => parseFloat(v.price));
      console.log("price",Math.min(...prices))
      return Math.min(...prices);
    }
   
    // Step 3: If nothing available, return 0
    return 0;
  }
