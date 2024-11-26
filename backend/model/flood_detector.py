import numpy as np
import cv2
from PIL import Image
import io
import base64
from io import BytesIO

class FloodDetector:
    def __init__(self):
        # Thresholds for water detection
        self.blue_threshold = 140
        self.ndwi_threshold = 0.3
    
    def calculate_ndwi(self, image):
        """
        Calculate Normalized Difference Water Index
        NDWI = (Green - NIR) / (Green + NIR)
        For RGB images, we'll use a simplified version using Blue channel as proxy
        """
        # Convert to float32 for calculations
        image = image.astype(np.float32)
        
        # Extract blue and green channels
        blue = image[:, :, 0]
        green = image[:, :, 1]
        
        # Calculate NDWI (simplified version)
        ndwi = np.zeros_like(blue)
        denominator = green + blue
        valid_pixels = denominator > 1e-8
        ndwi[valid_pixels] = (green[valid_pixels] - blue[valid_pixels]) / denominator[valid_pixels]
        
        return ndwi

    def detect_flood(self, image_bytes):
        """
        Detect potential flood areas in the image
        Returns: flood mask, affected area percentage, and confidence score
        """
        try:
            # Convert bytes to image
            image = Image.open(io.BytesIO(image_bytes))
            image = np.array(image)
            
            # Convert to RGB if image is in RGBA format
            if image.shape[-1] == 4:
                image = cv2.cvtColor(image, cv2.COLOR_RGBA2RGB)
            
            # Calculate NDWI
            ndwi = self.calculate_ndwi(image)
            
            # Create water mask using NDWI threshold
            water_mask = (ndwi > self.ndwi_threshold).astype(np.uint8) * 255
            
            # Apply morphological operations to clean up the mask
            kernel = np.ones((5,5), np.uint8)
            water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_OPEN, kernel)
            water_mask = cv2.morphologyEx(water_mask, cv2.MORPH_CLOSE, kernel)
            
            # Calculate affected area percentage
            total_pixels = water_mask.size
            flood_pixels = np.sum(water_mask > 0)
            affected_area_percentage = (flood_pixels / total_pixels) * 100
            
            # Calculate confidence score based on NDWI values in detected regions
            flood_regions = water_mask > 0
            if np.any(flood_regions):
                confidence_score = min(100, float(np.mean(ndwi[flood_regions]) * 100))
            else:
                confidence_score = 0
            
            # Determine risk level
            if affected_area_percentage < 10:
                risk_level = "Low"
            elif affected_area_percentage < 30:
                risk_level = "Medium"
            else:
                risk_level = "High"
            
            # Create visualization
            visualization = image.copy()
            if np.any(flood_regions):
                visualization[water_mask > 0] = [0, 0, 255]  # Mark flood areas in red
            
            # Convert visualization to uint8 if it's not already
            visualization = visualization.astype(np.uint8)
            
            # Convert the visualization to base64 string
            vis_image = Image.fromarray(visualization)
            buffered = BytesIO()
            vis_image.save(buffered, format="PNG")
            vis_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
            
            return {
                "success": True,
                "risk_level": risk_level,
                "affected_area": round(affected_area_percentage, 2),
                "confidence_score": round(confidence_score, 2),
                "visualization": f"data:image/png;base64,{vis_base64}"
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            } 