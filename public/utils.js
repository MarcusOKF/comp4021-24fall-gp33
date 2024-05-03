async function fetchData(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      // Handle any network or request errors
      console.error(`An error occurred: ${error}`);
      return null;
    }
}

function checkOverlap(circleX, circleY, radius, point1, point2, point3, point4) {
  // Calculate the squared distance between two points
  function distanceSquared(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return dx * dx + dy * dy;
  }

  // Check if a point is inside the circle
  function pointInsideCircle(x, y, circleX, circleY, radius) {
    const distSquared = distanceSquared(x, y, circleX, circleY);
    return distSquared <= radius * radius;
  }

  // Check if any of the shape's vertices are inside the circle
  if (
    pointInsideCircle(point1.x, point1.y, circleX, circleY, radius) ||
    pointInsideCircle(point2.x, point2.y, circleX, circleY, radius) ||
    pointInsideCircle(point3.x, point3.y, circleX, circleY, radius) ||
    pointInsideCircle(point4.x, point4.y, circleX, circleY, radius)
  ) {
    return true;
  }

  // Check if the circle intersects any of the shape's edges

  // Calculate the squared distance from the circle's center to a line segment
  function distanceToSegmentSquared(
    circleX,
    circleY,
    segmentX1,
    segmentY1,
    segmentX2,
    segmentY2
  ) {
    const dx = segmentX2 - segmentX1;
    const dy = segmentY2 - segmentY1;
    if (dx === 0 && dy === 0) {
      // The segment is just a point
      return distanceSquared(circleX, circleY, segmentX1, segmentY1);
    }

    const t =
      ((circleX - segmentX1) * dx + (circleY - segmentY1) * dy) /
      (dx * dx + dy * dy);
    if (t < 0) {
      // Closest point is beyond the segment's start point
      return distanceSquared(circleX, circleY, segmentX1, segmentY1);
    } else if (t > 1) {
      // Closest point is beyond the segment's end point
      return distanceSquared(circleX, circleY, segmentX2, segmentY2);
    }

    const closestX = segmentX1 + t * dx;
    const closestY = segmentY1 + t * dy;
    return distanceSquared(circleX, circleY, closestX, closestY);
  }

  // Check if the circle intersects any of the shape's edges
  const segments = [
    [point1.x, point1.y, point2.x, point2.y],
    [point2.x, point2.y, point3.x, point3.y],
    [point3.x, point3.y, point4.x, point4.y],
    [point4.x, point4.y, point1.x, point1.y],
  ];

  for (const segment of segments) {
    const distSquared = distanceToSegmentSquared(
      circleX,
      circleY,
      segment[0],
      segment[1],
      segment[2],
      segment[3]
    );
    if (distSquared <= radius * radius) {
      return true;
    }
  }

  return false;
}

