function TreeNode(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
}

function buildTree(arr) {
    if (!arr.length) return null;
    const nodes = arr.map(x => x === null ? null : new TreeNode(x));
    let i = 0, j = 1;

    while (j < nodes.length) {
        if (nodes[i] !== null) {
            nodes[i].left = nodes[j] || null;
            nodes[i].right = nodes[j + 1] || null;
            j += 2;
        }
        i++;
    }
    return nodes[0];
}

// 1. SAME TREE

var sametree = function (a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    if (a.val !== b.val) return false;

    return sametree(a.left, b.left) && sametree(a.right, b.right);
};

// 2. SYMMETRIC TREE

var symetrictree = function (root) {
    if (!root) return true;

    function ismirror(left, right) {
        if (!left && !right) return true;
        if (!left || !right) return false;
        if (left.val !== right.val) return false;

        return ismirror(left.left, right.right) && ismirror(left.right, right.left);
    }

    return ismirror(root.left, root.right);
};

// 3. INVERT TREE

var invertiontree = function (a) {
    if (!a) return null;
    const temp = a.left;
    a.left = invertiontree(a.right);
    a.right = invertiontree(temp);
    return a;
};


// 4. K-th SMALLEST

var smallestKfunc = function (root, k) {
    let count = 0;
    let ans = null;

    function inOrder(node) {
        if (!node || ans !== null) return;

        inOrder(node.left);
        count++;
        if (count === k) ans = node.val;
        inOrder(node.right);
    }

    inOrder(root);
    return ans;
};


// 5. SERIALIZE / DESERIALIZE TREE

var Codec = function () { };

Codec.prototype.serialize = function (root) {
    const out = [];

    function dfs(node) {
        if (!node) {
            out.push("null");
            return;
        }
        out.push(String(node.val));
        dfs(node.left);
        dfs(node.right);
    }

    dfs(root);
    return out.join(",");
};

Codec.prototype.deserialize = function (data) {
    if (!data) return null;

    const vals = data.split(",");
    let i = 0;

    function build() {
        if (vals[i] === "null") {
            i++;
            return null;
        }

        const node = new TreeNode(parseInt(vals[i]));
        i++;
        node.left = build();
        node.right = build();
        return node;
    }

    return build();
};


// 6. MAXIMUM PATH SUM

var maxPathSum = function (root) {
    let maxSum = -Infinity;

    function dfs(node) {
        if (!node) return 0;
        const left = Math.max(0, dfs(node.left));
        const right = Math.max(0, dfs(node.right));
        maxSum = Math.max(maxSum, node.val + left + right);
        return node.val + Math.max(left, right);
    }

    dfs(root);
    return maxSum;
};


// 7. MIN CAMERA COVER

var minCameraCover = function (root) {
    let cameras = 0;

    // 0 = needs camera
    // 1 = has camera
    // 2 = covered
    function dfs(node) {
        if (!node) return 2;

        const left = dfs(node.left);
        const right = dfs(node.right);

        if (left === 0 || right === 0) {
            cameras++;
            return 1;
        }
        if (left === 1 || right === 1) {
            return 2;
        }
        return 0;
    }

    if (dfs(root) === 0) cameras++;
    return cameras;
};


// 8. VERTICAL TRAVERSAL

var verticalTraversal = function (root) {
    const nodes = [];

    function dfs(node, row, col) {
        if (!node) return;
        nodes.push([col, row, node.val]);
        dfs(node.left, row + 1, col - 1);
        dfs(node.right, row + 1, col + 1);
    }

    dfs(root, 0, 0);

    nodes.sort((a, b) =>
        a[0] - b[0] ||
        a[1] - b[1] ||
        a[2] - b[2]
    );

    const res = [];
    let prevCol = null;

    for (const [col, row, val] of nodes) {
        if (col !== prevCol) {
            prevCol = col;
            res.push([]);
        }
        res[res.length - 1].push(val);
    }

    return res;
};

// 9. RECOVER TREE FROM PREORDER

var recoverfrompreorder = function (trav) {
    let i = 0;

    function parse(depth) {
        let dashCount = 0;
        let j = i;

        while (j < trav.length && trav[j] === "-") {
            dashCount++;
            j++;
        }

        if (dashCount !== depth) return null;

        i = j;
        let num = 0;
        while (i < trav.length && /\d/.test(trav[i])) {
            num = num * 10 + Number(trav[i]);
            i++;
        }

        const node = new TreeNode(num);
        node.left = parse(depth + 1);
        node.right = parse(depth + 1);
        return node;
    }

    return parse(0);
};


console.log("\n1) Same Tree:", sametree(
    buildTree([1, 2, 3]),
    buildTree([1, 2, 3])
));

console.log("\n2) Symmetric Tree:", symetrictree(
    buildTree([1, 2, 2, 3, 4, 4, 3])
));

console.log("\n3) Inverted Tree:", invertiontree(
    buildTree([4, 2, 7, 1, 3, 6, 9])
));

console.log("\n4) Kth Smallest:", smallestKfunc(
    buildTree([5, 3, 6, 2, 4, null, null, 1]),
    3
));

console.log("\n5) Serialize/Deserialize:");
const codec = new Codec();
let tree = buildTree([1, 2, 3, null, null, 4, 5]);
let ser = codec.serialize(tree);
console.log("Serialized:", ser);
console.log("Deserialized:", codec.deserialize(ser));

console.log("\n6) Max Path Sum:", maxPathSum(
    buildTree([1, 2, 3])
));

console.log("\n7) Min Camera Cover:", minCameraCover(
    buildTree([0, 0, null, 0, 0])
));

console.log("\n8) Vertical Traversal:", verticalTraversal(
    buildTree([3, 9, 20, null, null, 15, 7])
));

console.log("\n9) Recover Tree From Preorder:", recoverfrompreorder(
    "1-2--3--4-5--6--7"
));
